import { useEffect, useRef } from 'react'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

interface DrawEvent {
  features: {
    id?: string
    type: string
    geometry: {
      type: string
      coordinates: number[] | number[][] | number[][][]
    }
    properties: Record<string, unknown>
  }[]
}

export default function DrawPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const draw = useRef<MapboxDraw | null>(null)

  useEffect(() => {
    if (map.current) return

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [139.6917, 35.6895], // Tokyo coordinates
      zoom: 13,
    })

    // Initialize draw control
    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        line_string: true,
        point: true,
        trash: true,
      },
      defaultMode: 'draw_polygon',
    })

    // Add controls
    map.current.addControl(draw.current, 'top-left')
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Listen for draw events
    map.current.on('draw.create', (e: DrawEvent) => {
      // TODO: Implement state management for created features
      if (e.features[0]) {
        // Handle created feature
      }
    })

    map.current.on('draw.update', (e: DrawEvent) => {
      // TODO: Implement state management for updated features
      if (e.features[0]) {
        // Handle updated feature
      }
    })

    map.current.on('draw.delete', (e: DrawEvent) => {
      // TODO: Implement state management for deleted features
      if (e.features[0]) {
        // Handle deleted feature
      }
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
      draw.current = null
    }
  }, [])

  return (
    <div className='flex h-full flex-col'>
      <div className='bg-background border-b p-4'>
        <h2 className='text-lg font-semibold'>Draw Tools</h2>
        <p className='text-muted-foreground text-sm'>
          Use the drawing tools to create polygons, lines, and points on the map
        </p>
      </div>
      <div className='min-h-0 flex-1'>
        <div
          ref={mapContainer}
          data-testid="map-container"
          className='h-full w-full'
          style={{ minHeight: '500px' }}
        />
      </div>
    </div>
  )
}
