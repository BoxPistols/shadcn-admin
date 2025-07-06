#!/bin/bash

# Git安全性設定スクリプト
# このスクリプトは安全なフォーク管理のためのgitエイリアスと設定をセットアップします

set -e

# 出力用カラー設定
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # カラーなし

echo -e "${BLUE}🔧 Git安全性設定を開始しています...${NC}"

# 安全なgitエイリアスの設定
echo -e "${YELLOW}📝 gitエイリアスを設定しています...${NC}"

# 安全なプッシュエイリアス
git config --global alias.push-origin '!f() { git push origin $(git branch --show-current); }; f'
git config --global alias.po '!f() { git push origin $(git branch --show-current); }; f'

# 安全なPR作成エイリアス
git config --global alias.pr-fork '!f() { gh pr create --repo BoxPistols/shadcn-admin; }; f'
git config --global alias.pr-upstream '!f() { gh pr create --repo satnaing/shadcn-admin --base main --head BoxPistols:$(git branch --show-current); }; f'

# 同期エイリアス
git config --global alias.sync-upstream '!f() { git fetch upstream && git checkout main && git merge upstream/main && git push origin main; }; f'
git config --global alias.sync '!f() { git fetch upstream && git checkout main && git merge upstream/main && git push origin main; }; f'

# ブランチ管理エイリアス
git config --global alias.new-feature '!f() { git checkout main && git pull origin main && git checkout -b feature/$1; }; f'
git config --global alias.finish-feature '!f() { BRANCH=$(git branch --show-current); git checkout main && git branch -d $BRANCH; }; f'

echo -e "${GREEN}✅ gitエイリアスが設定されました:${NC}"
echo -e "  ${BLUE}git po${NC}                  - オリジンへプッシュ（安全）"
echo -e "  ${BLUE}git push-origin${NC}         - オリジンへプッシュ（安全）"
echo -e "  ${BLUE}git pr-fork${NC}             - フォーク内でPR作成"
echo -e "  ${BLUE}git pr-upstream${NC}         - アップストリームへPR作成"
echo -e "  ${BLUE}git sync${NC}                - アップストリームと同期"
echo -e "  ${BLUE}git sync-upstream${NC}       - アップストリームと同期"
echo -e "  ${BLUE}git new-feature <名前>${NC}  - 新しいフィーチャーブランチを作成"
echo -e "  ${BLUE}git finish-feature${NC}      - フィーチャーブランチをクリーンアップ"

# プッシュ時に常にリモートを確認するようにgitを設定
echo -e "${YELLOW}⚙️  gitプッシュ動作を設定しています...${NC}"
git config --global push.default simple
git config --global push.autoSetupRemote false

# GitHub CLI設定
echo -e "${YELLOW}⚙️  GitHub CLIを設定しています...${NC}"
gh config set prompt enabled
gh config set git_protocol https

# pre-pushフックの存在確認
if [ -f ".git/hooks/pre-push" ]; then
    echo -e "${GREEN}✅ pre-pushフックが既に存在します${NC}"
else
    echo -e "${YELLOW}⚠️  pre-pushフックが見つかりません${NC}"
    echo -e "${YELLOW}   リポジトリのルートからこのスクリプトを実行してください${NC}"
fi

# シェルエイリアスの設定（現在のセッション用）
echo -e "${YELLOW}📝 シェルエイリアスを設定しています...${NC}"

# エイリアス用のシェルスクリプトを作成
cat >~/.git-safety-aliases <<'EOF'
# Git安全性エイリアス
alias pgf='gh pr create --repo BoxPistols/shadcn-admin'
alias pgu='gh pr create --repo satnaing/shadcn-admin --base main --head BoxPistols:$(git branch --show-current)'
alias gpo='git push origin $(git branch --show-current)'
alias gsync='git fetch upstream && git checkout main && git merge upstream/main && git push origin main'

# 安全性チェック機能
git-safety-check() {
    echo "🔍 Git安全性ステータス:"
    echo "現在のブランチ: $(git branch --show-current)"
    echo "リポジトリ: $(git remote get-url origin)"
    echo "アップストリーム: $(git remote get-url upstream 2>/dev/null || echo '未設定')"
    echo ""
    echo "安全なコマンド:"
    echo "  gpo     - オリジンへプッシュ"
    echo "  pgf     - フォークへPR"
    echo "  pgu     - アップストリームへPR"
    echo "  gsync   - アップストリームと同期"
}
EOF

echo -e "${GREEN}✅ シェルエイリアスが ~/.git-safety-aliases に作成されました${NC}"
echo -e "${YELLOW}💡 シェルプロファイルに 'source ~/.git-safety-aliases' を追加してください${NC}"

# 一般的なシェルプロファイルに追加
for shell_profile in ~/.bashrc ~/.zshrc ~/.bash_profile; do
    if [ -f "$shell_profile" ]; then
        if ! grep -q "source ~/.git-safety-aliases" "$shell_profile"; then
            echo "source ~/.git-safety-aliases" >>"$shell_profile"
            echo -e "${GREEN}✅ $shell_profile に追加されました${NC}"
        fi
    fi
done

echo -e "${GREEN}🎉 Git安全性設定が完了しました！${NC}"
echo -e "${YELLOW}🔄 シェルを再読み込みするか 'source ~/.git-safety-aliases' を実行して新しいエイリアスを使用してください${NC}"
echo -e "${BLUE}ℹ️  'git-safety-check' を実行して利用可能な安全なコマンドを確認してください${NC}"
