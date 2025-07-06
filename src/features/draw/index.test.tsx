import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import DrawPage from './index'

// Mock mapbox-gl and @mapbox/mapbox-gl-draw
vi.mock('mapbox-gl', () => ({
  default: {
    Map: vi.fn(() => ({
      addControl: vi.fn(),
      on: vi.fn(),
      remove: vi.fn(),
    })),
    NavigationControl: vi.fn(),
  },
}))

vi.mock('@mapbox/mapbox-gl-draw', () => ({
  default: vi.fn(() => ({})),
}))

describe('DrawPage', () => {
  it('renders the draw page with a map container', () => {
    render(<DrawPage />)

    // Check if the heading is rendered
    expect(screen.getByText('Draw Tools')).toBeInTheDocument()

    // Check if the map container is rendered
    const mapContainer = screen.getByTestId('map-container')
    expect(mapContainer).toBeInTheDocument()
  })
})
