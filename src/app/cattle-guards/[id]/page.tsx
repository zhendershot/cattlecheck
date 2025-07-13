'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Navbar } from '@/components/Navbar'
import { RatingForm } from '@/components/RatingForm'
import { Star, Edit, User, Camera, MapPin, History } from 'lucide-react'
import Image from 'next/image'

const Map = dynamic(() => import('@/components/Map').then(mod => ({ default: mod.Map })), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg" />
})

interface CattleGuardDetail {
  id: string
  name: string
  description: string | null
  latitude: number
  longitude: number
  averageRating: number
  totalRatings: number
  createdAt: string
  createdBy: {
    id: string
    name: string | null
    image: string | null
  }
  ratings: Rating[]
  images: GuardImage[]
  edits: Edit[]
}

interface Rating {
  id: string
  rating: number
  comment: string | null
  smoothness: number
  scenicView: number
  upkeep: number
  accessibility: number
  coolnessFactor: number
  createdAt: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

interface GuardImage {
  id: string
  url: string
  alt: string | null
}

interface Edit {
  id: string
  field: string
  oldValue: string | null
  newValue: string | null
  createdAt: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

interface RatingData {
  rating: number
  comment: string
  smoothness: number
  scenicView: number
  upkeep: number
  accessibility: number
  coolnessFactor: number
}

export default function CattleGuardDetailPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [cattleGuard, setCattleGuard] = useState<CattleGuardDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showRatingForm, setShowRatingForm] = useState(false)
  // const [showEditForm, setShowEditForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'reviews' | 'photos' | 'history'>('reviews')

  const fetchCattleGuard = useCallback(async () => {
    try {
      const response = await fetch(`/api/cattle-guards/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setCattleGuard(data)
      }
    } catch (error) {
      console.error('Failed to fetch cattle guard:', error)
    } finally {
      setIsLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    if (params.id) {
      fetchCattleGuard()
    }
  }, [fetchCattleGuard, params.id])

  const handleRatingSubmit = async (ratingData: RatingData) => {
    try {
      const response = await fetch(`/api/cattle-guards/${params.id}/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ratingData),
      })

      if (response.ok) {
        setShowRatingForm(false)
        fetchCattleGuard()
      }
    } catch (error) {
      console.error('Failed to submit rating:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!cattleGuard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Cattle Guard Not Found</h1>
            <p className="text-gray-600 mt-2">This cattle guard seems to have wandered off...</p>
          </div>
        </div>
      </div>
    )
  }

  const userRating = cattleGuard.ratings.find(r => r.user.id === session?.user?.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {cattleGuard.name}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{cattleGuard.averageRating.toFixed(1)}</span>
                  <span>({cattleGuard.totalRatings} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{cattleGuard.latitude.toFixed(4)}, {cattleGuard.longitude.toFixed(4)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex gap-3">
              {session && (
                <>
                  <button
                    onClick={() => setShowRatingForm(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    {userRating ? '✏️ Update Review' : '⭐ Rate This Guard'}
                  </button>
                  {/* <button
                    onClick={() => setShowEditForm(true)}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4 inline mr-1" />
                    Edit Details
                  </button> */}
                </>
              )}
            </div>
          </div>

          {cattleGuard.description && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{cattleGuard.description}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📍 Location</h2>
            <Map
              cattleGuards={[{
                id: cattleGuard.id,
                name: cattleGuard.name,
                latitude: cattleGuard.latitude,
                longitude: cattleGuard.longitude,
                averageRating: cattleGuard.averageRating,
                totalRatings: cattleGuard.totalRatings,
              }]}
              center={[cattleGuard.latitude, cattleGuard.longitude]}
              zoom={15}
            />
          </div>

          {/* Rating Breakdown */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">🎯 Rating Breakdown</h2>
            {cattleGuard.ratings.length > 0 ? (
              <div className="space-y-3">
                {[
                  { key: 'smoothness', label: 'Smoothness', emoji: '🧈' },
                  { key: 'scenicView', label: 'Scenic View', emoji: '🌄' },
                  { key: 'upkeep', label: 'Upkeep', emoji: '🔧' },
                  { key: 'accessibility', label: 'Accessibility', emoji: '♿' },
                  { key: 'coolnessFactor', label: 'Coolness Factor', emoji: '😎' },
                ].map((criterion: { key: string; label: string; emoji: string }) => {
                  const avg = cattleGuard.ratings.reduce((sum, r) => {
                    const value = r[criterion.key as keyof Rating] as number
                    return sum + value
                  }, 0) / cattleGuard.ratings.length
                  return (
                    <div key={criterion.key} className="flex items-center justify-between">
                      <span className="text-gray-700">
                        {criterion.emoji} {criterion.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(avg / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-8">{avg.toFixed(1)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No ratings yet! Be the first to rate this cattle guard! 🎉
              </p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { id: 'reviews', label: '💬 Reviews', count: cattleGuard.ratings.length },
                  { id: 'photos', label: '📸 Photos', count: cattleGuard.images.length },
                  { id: 'history', label: '📜 Edit History', count: cattleGuard.edits.length },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'reviews' | 'photos' | 'history')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {cattleGuard.ratings.map(rating => (
                    <div key={rating.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {rating.user.image ? (
                              <Image
                                src={rating.user.image}
                                alt={rating.user.name || 'User'}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            ) : (
                              <User className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{rating.user.name || 'Anonymous'}</span>
                            <div className="flex items-center gap-1">
                              {[...Array(rating.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {rating.comment && (
                            <p className="text-gray-700 mb-2">{rating.comment}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {cattleGuard.ratings.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No reviews yet! Share your experience with this cattle guard! 🌟
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'photos' && (
                <div>
                  {cattleGuard.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {cattleGuard.images.map(image => (
                        <div key={image.id} className="aspect-square relative">
                          <Image
                            src={image.url}
                            alt={image.alt || 'Cattle guard photo'}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No photos yet! Upload the first one!</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4">
                  {cattleGuard.edits.map(edit => (
                    <div key={edit.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <History className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm">
                          <span className="font-semibold">{edit.user.name || 'Anonymous'}</span>
                          {' '}edited <span className="font-medium">{edit.field}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(edit.createdAt).toLocaleString()}
                        </p>
                        {edit.oldValue && edit.newValue && (
                          <div className="mt-2 text-xs">
                            <div className="text-red-600">- {edit.oldValue}</div>
                            <div className="text-green-600">+ {edit.newValue}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {cattleGuard.edits.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No edit history yet! This cattle guard is pristine! ✨
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rating Form Modal */}
      {showRatingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <RatingForm
              cattleGuardId={cattleGuard.id}
              onSubmit={handleRatingSubmit}
              onCancel={() => setShowRatingForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}