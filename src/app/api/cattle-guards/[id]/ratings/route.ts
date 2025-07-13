import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      rating, 
      comment, 
      smoothness, 
      scenicView, 
      upkeep, 
      accessibility, 
      coolnessFactor 
    } = body

    // Validate required fields
    if (!rating || !smoothness || !scenicView || !upkeep || !accessibility || !coolnessFactor) {
      return NextResponse.json(
        { error: 'All rating criteria are required' },
        { status: 400 }
      )
    }

    // Validate rating values are between 1-10
    const ratings = [rating, smoothness, scenicView, upkeep, accessibility, coolnessFactor]
    if (ratings.some(r => r < 1 || r > 10)) {
      return NextResponse.json(
        { error: 'All ratings must be between 1 and 10' },
        { status: 400 }
      )
    }

    // Check if cattle guard exists
    const cattleGuard = await prisma.cattleGuard.findUnique({
      where: { id: params.id }
    })

    if (!cattleGuard) {
      return NextResponse.json(
        { error: 'Cattle guard not found' },
        { status: 404 }
      )
    }

    // Use transaction to create rating and update aggregate data
    const result = await prisma.$transaction(async (tx) => {
      // Upsert the rating (create or update if user already rated this guard)
      const newRating = await tx.rating.upsert({
        where: {
          userId_cattleGuardId: {
            userId: session.user.id,
            cattleGuardId: params.id
          }
        },
        update: {
          rating,
          comment,
          smoothness,
          scenicView,
          upkeep,
          accessibility,
          coolnessFactor,
        },
        create: {
          rating,
          comment,
          smoothness,
          scenicView,
          upkeep,
          accessibility,
          coolnessFactor,
          userId: session.user.id,
          cattleGuardId: params.id,
        },
      })

      // Recalculate average rating and total count
      const allRatings = await tx.rating.findMany({
        where: { cattleGuardId: params.id },
        select: { rating: true }
      })

      const totalRatings = allRatings.length
      const averageRating = totalRatings > 0 
        ? allRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
        : 0

      // Update cattle guard with new aggregates
      await tx.cattleGuard.update({
        where: { id: params.id },
        data: {
          averageRating,
          totalRatings,
        },
      })

      return newRating
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating rating:', error)
    return NextResponse.json(
      { error: 'Failed to create rating' },
      { status: 500 }
    )
  }
}