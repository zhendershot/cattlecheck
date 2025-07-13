'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Star, MapPin, Calendar, Search, Filter } from 'lucide-react'

interface CattleGuard {
  id: string
  name: string
  latitude: number
  longitude: number
  averageRating: number
  totalRatings: number
  createdAt: string
}

export default function CattleGuardsPage() {
  const [cattleGuards, setCattleGuards] = useState<CattleGuard[]>([])
  const [filteredGuards, setFilteredGuards] = useState<CattleGuard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'name'>('rating')

  const fetchCattleGuards = async () => {
    try {
      const response = await fetch('/api/cattle-guards')
      if (response.ok) {
        const data = await response.json() as CattleGuard[]
        setCattleGuards(data)
      }
    } catch (error) {
      console.error('Failed to fetch cattle guards:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortGuards = useCallback(() => {
    const filtered = cattleGuards.filter(guard =>
      guard.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.averageRating - a.averageRating)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    setFilteredGuards(filtered)
  }, [cattleGuards, searchTerm, sortBy])

  useEffect(() => {
    fetchCattleGuards()
  }, [])

  useEffect(() => {
    filterAndSortGuards()
  }, [filterAndSortGuards])

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600'
    if (rating >= 6) return 'text-yellow-600'
    if (rating >= 4) return 'text-orange-600'
    return 'text-red-600'
  }

  const getRatingLabel = (rating: number) => {
    if (rating >= 9) return 'Legendary! 🌟'
    if (rating >= 8) return 'Excellent 🏆'
    if (rating >= 7) return 'Great 👍'
    if (rating >= 6) return 'Good ✅'
    if (rating >= 5) return 'Okay 😐'
    if (rating >= 4) return 'Meh 😕'
    if (rating >= 3) return 'Poor 👎'
    return 'Needs Work 😱'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🐄 All Cattle Guards
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover and explore {cattleGuards.length} amazing cattle guards rated by our community!
          </p>

          {/* Search and Filter */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cattle guards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'rating' | 'newest' | 'name')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600">{cattleGuards.length}</div>
            <div className="text-gray-600">Total Guards</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600">
              {cattleGuards.reduce((sum, guard) => sum + guard.totalRatings, 0)}
            </div>
            <div className="text-gray-600">Total Reviews</div>
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
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {cattleGuards.filter(g => g.averageRating >= 8).length}
            </div>
            <div className="text-gray-600">Elite Guards</div>
          </div>
        </div>

        {/* Cattle Guards Grid */}
        <div className="space-y-6">
          {filteredGuards.length > 0 ? (
            filteredGuards.map((guard, index) => (
              <Link key={guard.id} href={`/cattle-guards/${guard.id}`}>
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 cursor-pointer group">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {guard.name}
                        </h3>
                        {index < 3 && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                            Top {index + 1}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">
                            {guard.latitude.toFixed(4)}, {guard.longitude.toFixed(4)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            Added {new Date(guard.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                      <div className="text-center">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className={`text-2xl font-bold ${getRatingColor(guard.averageRating)}`}>
                            {guard.averageRating.toFixed(1)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {guard.totalRatings} reviews
                        </div>
                        <div className="text-xs font-medium mt-1">
                          {getRatingLabel(guard.averageRating)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No cattle guards found
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 
                  'Try adjusting your search term or filters.' : 
                  'Be the first to add a cattle guard to our community!'
                }
              </p>
            </div>
          )}
        </div>

        {/* Load More / Pagination would go here */}
        {filteredGuards.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <span>Showing {filteredGuards.length} of {cattleGuards.length} cattle guards</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}