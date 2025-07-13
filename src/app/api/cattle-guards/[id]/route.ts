import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const cattleGuard = await prisma.cattleGuard.findUnique({
      where: { id },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        images: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        edits: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    })

    if (!cattleGuard) {
      return NextResponse.json(
        { error: 'Cattle guard not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(cattleGuard)
  } catch (error) {
    console.error('Error fetching cattle guard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cattle guard' },
      { status: 500 }
    )
  }
}