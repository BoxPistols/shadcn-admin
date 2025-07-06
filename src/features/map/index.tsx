import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

// Mock taxi data
const mockTaxis = [
  {
    id: 'taxi-1',
    lat: 35.6895,
    lng: 139.6917,
    driver: 'Yamada',
    available: true,
  },
  {
    id: 'taxi-2',
    lat: 35.6905,
    lng: 139.6927,
    driver: 'Tanaka',
    available: false,
  },
  {
    id: 'taxi-3',
    lat: 35.6885,
    lng: 139.6907,
    driver: 'Sato',
    available: true,
  },
  { id: 'taxi-4', lat: 35.691, lng: 139.69, driver: 'Suzuki', available: true },
]

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [selectedTaxi, setSelectedTaxi] = useState<string | null>(null)

  useEffect(() => {
    if (map.current) return

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [139.6917, 35.6895], // Tokyo coordinates
      zoom: 13,
    })

    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl())

    // Add taxi markers
    mockTaxis.forEach((taxi) => {
      const el = document.createElement('div')
      el.className = 'taxi-marker'
      el.style.backgroundColor = taxi.available ? '#10b981' : '#ef4444'
      el.style.width = '20px'
      el.style.height = '20px'
      el.style.borderRadius = '50%'
      el.style.border = '2px solid white'
      el.style.cursor = 'pointer'
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)'

      new mapboxgl.Marker(el)
        .setLngLat([taxi.lng, taxi.lat])
        .addTo(map.current!)

      // Add click event to marker
      el.addEventListener('click', () => {
        setSelectedTaxi(taxi.id)
      })
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  const selectedTaxiData = selectedTaxi
    ? mockTaxis.find((t) => t.id === selectedTaxi)
    : null

  return (
    <div className='flex h-full flex-col'>
      <div className='bg-background border-b p-4'>
        <h2 className='text-lg font-semibold'>Taxi Tracking Map</h2>
        <p className='text-muted-foreground text-sm'>
          Track taxi locations in real-time. Green markers are available, red
          are busy.
        </p>
      </div>

      <div className='flex min-h-0 flex-1'>
        <div className='flex-1'>
          <div
            ref={mapContainer}
            className='h-full w-full'
            style={{ minHeight: '500px' }}
          />
        </div>

        {selectedTaxiData && (
          <Card className='m-4 w-80'>
            <CardHeader>
              <CardTitle>Taxi Details</CardTitle>
              <CardDescription>Selected: {selectedTaxiData.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span>Driver:</span>
                  <span className='font-medium'>{selectedTaxiData.driver}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Status:</span>
                  <span
                    className={`font-medium ${selectedTaxiData.available ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {selectedTaxiData.available ? 'Available' : 'Busy'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Location:</span>
                  <span className='text-xs font-medium'>
                    {selectedTaxiData.lat.toFixed(4)},{' '}
                    {selectedTaxiData.lng.toFixed(4)}
                  </span>
                </div>
                <Button
                  className='mt-4 w-full'
                  disabled={!selectedTaxiData.available}
                  onClick={() => setSelectedTaxi(null)}
                >
                  {selectedTaxiData.available ? 'Book Taxi' : 'Not Available'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
