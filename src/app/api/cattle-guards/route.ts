import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cattleGuards = await prisma.cattleGuard.findMany({
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        averageRating: true,
        totalRatings: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(cattleGuards)
  } catch (error) {
    console.error('Error fetching cattle guards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cattle guards' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, latitude, longitude } = body

    if (!name || typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { error: 'Name, latitude, and longitude are required' },
        { status: 400 }
      )
    }

    // Check if a cattle guard already exists very close to this location
    const existingGuard = await prisma.cattleGuard.findFirst({
      where: {
        AND: [
          { latitude: { gte: latitude - 0.001, lte: latitude + 0.001 } },
          { longitude: { gte: longitude - 0.001, lte: longitude + 0.001 } }
        ]
      }
    })

    if (existingGuard) {
      return NextResponse.json(
        { error: 'A cattle guard already exists very close to this location' },
        { status: 409 }
      )
    }

    const cattleGuard = await prisma.cattleGuard.create({
      data: {
        name,
        description,
        latitude,
        longitude,
        createdById: session.user.id,
      },
    })

    return NextResponse.json(cattleGuard, { status: 201 })
  } catch (error) {
    console.error('Error creating cattle guard:', error)
    return NextResponse.json(
      { error: 'Failed to create cattle guard' },
      { status: 500 }
    )
  }
}