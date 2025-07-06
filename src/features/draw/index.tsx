import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

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
      zoom: 13
    })

    // Initialize draw control
    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        line_string: true,
        point: true,
        trash: true
      },
      defaultMode: 'draw_polygon'
    })

    // Add controls
    map.current.addControl(draw.current, 'top-left')
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Listen for draw events
    map.current.on('draw.create', (e: DrawEvent) => {
      // Feature created - could add to state management here
      if (e.features[0]) {
        // Handle created feature
      }
    })

    map.current.on('draw.update', (e: DrawEvent) => {
      // Feature updated - could add to state management here
      if (e.features[0]) {
        // Handle updated feature
      }
    })

    map.current.on('draw.delete', (e: DrawEvent) => {
      // Feature deleted - could add to state management here
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
    <div className="flex flex-col h-full">
      <div className="p-4 bg-background border-b">
        <h2 className="text-lg font-semibold">Draw Tools</h2>
        <p className="text-sm text-muted-foreground">
          Use the drawing tools to create polygons, lines, and points on the map
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <div 
          ref={mapContainer}
          className="w-full h-full"
          style={{ minHeight: '500px' }}
        />
      </div>
    </div>
  )
}