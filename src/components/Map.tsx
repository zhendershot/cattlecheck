'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in React-Leaflet
// Fix for default markers in React-Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom cattle guard icon
const cattleGuardIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8B4513" width="32" height="32">
      <path d="M3 12h18M3 8h18M3 16h18M6 6v12M9 6v12M12 6v12M15 6v12M18 6v12"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

interface CattleGuard {
  id: string
  name: string
  latitude: number
  longitude: number
  averageRating: number
  totalRatings: number
}

interface MapProps {
  cattleGuards: CattleGuard[]
  onMapClick?: (lat: number, lng: number) => void
  center?: [number, number]
  zoom?: number
}

function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng)
      }
    },
  })
  return null
}

export function Map({ cattleGuards, onMapClick, center = [39.8283, -98.5795], zoom = 4 }: MapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg" />
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-96 rounded-lg z-10"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
      
      {cattleGuards.map((guard) => (
        <Marker
          key={guard.id}
          position={[guard.latitude, guard.longitude]}
          icon={cattleGuardIcon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg">{guard.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold">{guard.averageRating.toFixed(1)}</span>
                <span className="text-gray-500">({guard.totalRatings} reviews)</span>
              </div>
              <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}