'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { Navbar } from '@/components/Navbar'
import { X } from 'lucide-react'

const Map = dynamic(() => import('@/components/Map').then(mod => ({ default: mod.Map })), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg" />
})

interface CattleGuard {
  id: string
  name: string
  latitude: number
  longitude: number
  averageRating: number
  totalRatings: number
}

export default function MapPage() {
  const { data: session } = useSession()
  const [cattleGuards, setCattleGuards] = useState<CattleGuard[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newGuardLocation, setNewGuardLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCattleGuards()
  }, [])

  const fetchCattleGuards = async () => {
    try {
      const response = await fetch('/api/cattle-guards')
      const data = await response.json()
      setCattleGuards(data)
    } catch (error) {
      console.error('Failed to fetch cattle guards:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMapClick = (lat: number, lng: number) => {
    if (!session) {
      alert('Please sign in to add cattle guards!')
      return
    }
    
    setNewGuardLocation({ lat, lng })
    setShowAddForm(true)
  }

  const handleAddGuard = async (name: string, description?: string) => {
    if (!newGuardLocation || !session) return

    try {
      const response = await fetch('/api/cattle-guards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          latitude: newGuardLocation.lat,
          longitude: newGuardLocation.lng,
        }),
      })

      if (response.ok) {
        fetchCattleGuards()
        setShowAddForm(false)
        setNewGuardLocation(null)
      }
    } catch (error) {
      console.error('Failed to add cattle guard:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🗺️ Cattle Guard Explorer
          </h1>
          <p className="text-lg text-gray-600">
            Discover amazing cattle guards around the world! Click on any marker to see ratings, or click anywhere on the map to add a new one.
          </p>
          
          {!session && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                📝 <strong>Want to contribute?</strong> Sign in to add new cattle guards and rate existing ones!
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Interactive Map</h2>
              <div className="text-sm">
                {cattleGuards.length} cattle guards discovered
              </div>
            </div>
          </div>
          
          <div className="p-4">
            {isLoading ? (
              <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Loading epic cattle guards...</p>
              </div>
            ) : (
              <Map
                cattleGuards={cattleGuards}
                onMapClick={handleMapClick}
                center={[39.8283, -98.5795]}
                zoom={4}
              />
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600">{cattleGuards.length}</div>
            <div className="text-gray-600">Total Cattle Guards</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600">
              {cattleGuards.reduce((sum, guard) => sum + guard.totalRatings, 0)}
            </div>
            <div className="text-gray-600">Community Reviews</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600">
              {cattleGuards.length > 0 
                ? (cattleGuards.reduce((sum, guard) => sum + guard.averageRating, 0) / cattleGuards.length).toFixed(1)
                : '0.0'
              }
            </div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Add Cattle Guard Modal */}
      {showAddForm && newGuardLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  🎯 Add New Cattle Guard
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setNewGuardLocation(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">
                Latitude: {newGuardLocation.lat.toFixed(6)}<br />
                Longitude: {newGuardLocation.lng.toFixed(6)}
              </p>
              
              <AddGuardForm
                onSubmit={handleAddGuard}
                onCancel={() => {
                  setShowAddForm(false)
                  setNewGuardLocation(null)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AddGuardForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (name: string, description?: string) => void
  onCancel: () => void 
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim(), description.trim() || undefined)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cattle Guard Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Highway 95 Crossing, Ranch Road Beauty"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell us what makes this cattle guard special..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>
      
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          🎉 Add Cattle Guard
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}