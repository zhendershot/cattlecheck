'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface RatingFormProps {
  cattleGuardId?: string
  onSubmit: (rating: RatingData) => void
  onCancel?: () => void
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

const RATING_CRITERIA = [
  {
    key: 'smoothness' as keyof RatingData,
    title: '🚗 Smoothness Factor',
    description: 'How buttery smooth is this cattle guard? Does it glide like a dream or rattle your bones?',
    emoji: '🧈'
  },
  {
    key: 'scenicView' as keyof RatingData,
    title: '🌄 Scenic Splendor',
    description: 'Are you crossing into cattle guard paradise or just another forgettable stretch of road?',
    emoji: '🎨'
  },
  {
    key: 'upkeep' as keyof RatingData,
    title: '🔧 Maintenance Magnificence',
    description: 'Is this cattle guard a well-oiled machine or showing its battle scars?',
    emoji: '✨'
  },
  {
    key: 'accessibility' as keyof RatingData,
    title: '♿ Accessibility Awesomeness',
    description: 'Can everyone experience this cattle guard glory, or is it an exclusive club?',
    emoji: '🌈'
  },
  {
    key: 'coolnessFactor' as keyof RatingData,
    title: '😎 Pure Coolness Quotient',
    description: 'That je ne sais quoi that makes this cattle guard special. The X-factor!',
    emoji: '🔥'
  }
]

export function RatingForm({ onSubmit, onCancel }: RatingFormProps) {
  const [formData, setFormData] = useState<RatingData>({
    rating: 0,
    comment: '',
    smoothness: 0,
    scenicView: 0,
    upkeep: 0,
    accessibility: 0,
    coolnessFactor: 0
  })

  const [hoveredRating, setHoveredRating] = useState<{ [key: string]: number }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.rating === 0) {
      alert('Please give an overall rating!')
      return
    }

    const hasAllCriteria = RATING_CRITERIA.every(criteria => (formData[criteria.key] as number) > 0)
    if (!hasAllCriteria) {
      alert('Please rate all the awesome criteria!')
      return
    }

    onSubmit(formData)
  }

  const renderStars = (
    value: number, 
    onChange: (rating: number) => void,
    onHover: (rating: number) => void,
    onLeave: () => void,
    hoverValue: number = 0
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 cursor-pointer transition-colors ${
              star <= (hoverValue || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
            onClick={() => onChange(star)}
            onMouseEnter={() => onHover(star)}
            onMouseLeave={onLeave}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🐄 Rate This Magnificent Cattle Guard! 🐄
        </h2>
        <p className="text-gray-600">
          Time to spill the tea on this road-crossing contraption! Your fellow cattle guard enthusiasts are counting on you!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <label className="block text-lg font-semibold text-gray-800 mb-2">
            ⭐ Overall Cattle Guard Awesomeness
          </label>
          <p className="text-sm text-gray-600 mb-3">
            What&apos;s your gut feeling? Rate this bad boy on the scale of cattle guard excellence!
          </p>
          {renderStars(
            formData.rating,
            (rating) => setFormData(prev => ({ ...prev, rating })),
            (rating) => setHoveredRating(prev => ({ ...prev, overall: rating })),
            () => setHoveredRating(prev => ({ ...prev, overall: 0 })),
            hoveredRating.overall
          )}
          <p className="text-sm text-gray-500 mt-1">
            {formData.rating > 0 && `${formData.rating}/10 - ${getRatingDescription(formData.rating)}`}
          </p>
        </div>

        {/* Detailed Criteria */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
            🎯 The Nitty-Gritty Details
          </h3>
          {RATING_CRITERIA.map((criteria) => (
            <div key={criteria.key} className="bg-gray-50 p-4 rounded-lg">
              <label className="block font-semibold text-gray-800 mb-1">
                {criteria.title} {criteria.emoji}
              </label>
              <p className="text-sm text-gray-600 mb-3">{criteria.description}</p>
              {renderStars(
                formData[criteria.key] as number,
                (rating) => setFormData(prev => ({ ...prev, [criteria.key]: rating })),
                (rating) => setHoveredRating(prev => ({ ...prev, [criteria.key]: rating })),
                () => setHoveredRating(prev => ({ ...prev, [criteria.key]: 0 })),
                hoveredRating[criteria.key]
              )}
            </div>
          ))}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-2">
            💭 Share Your Cattle Guard Story
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Got any epic tales, hilarious encounters, or profound thoughts about this cattle guard? Spill it all!
          </p>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            placeholder="This cattle guard changed my life because..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            🎉 Submit My Epic Review!
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

function getRatingDescription(rating: number): string {
  if (rating <= 2) return "Cattle Guard Catastrophe 😱"
  if (rating <= 4) return "Meh-dium Crossing 😐"
  if (rating <= 6) return "Decent Cattle Deterrent 👍"
  if (rating <= 8) return "Pretty Awesome Grid 🚀"
  if (rating <= 9) return "Cattle Guard Excellence! 🏆"
  return "LEGENDARY CROSSING! 🌟"
}