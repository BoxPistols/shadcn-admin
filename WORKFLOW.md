# Gitワークフローガイド

## リモート設定

- **origin**: `BoxPistols/shadcn-admin.git` (あなたのフォーク - fetch/push)
- **upstream**: `satnaing/shadcn-admin.git` (オリジナルリポジトリ - fetchのみ)

## 日常のワークフロー

### 1. 最新の変更を取得

```bash
# upstreamから最新の変更を取得
git fetch upstream

# mainブランチを最新に更新
git checkout main
git merge upstream/main
git push origin main
```

### 2. フィーチャーブランチ作成

```bash
# mainから最新の状態でフィーチャーブランチを作成
git checkout main
git checkout -b feature/your-feature-name
```

### 3. 開発・コミット

```bash
# 開発作業
git add .
git commit -m "feat: your feature description"
```

### 4. プッシュ（必ずoriginへ）

```bash
# 自分のフォークにプッシュ
git push origin feature/your-feature-name
```

### 5. プルリクエスト作成

```bash
# GitHub CLIを使用してPR作成（originからupstreamへ）
gh pr create --repo satnaing/shadcn-admin --base main --head BoxPistols:feature/your-feature-name
```

## 注意事項

- **絶対にupstreamには直接プッシュしない**
- **すべてのプッシュはorigin（BoxPistols/shadcn-admin）へ**
- **upstreamは読み取り専用として使用**
- **定期的にupstreamから最新の変更を取得**

## 緊急時の対応

もし間違ってupstreamにプッシュしようとした場合：

```bash
# プッシュをキャンセル（Ctrl+C）
# またはプッシュ後に即座にPRをClose
```
