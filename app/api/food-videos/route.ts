import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const videos = await prisma.foodVideo.findMany({ orderBy: { createdAt: 'asc' } })
  return NextResponse.json(videos.map(v => ({ ...v, types: JSON.parse(v.types) })))
}

export async function POST(req: Request) {
  const { name, url, types } = await req.json()
  const video = await prisma.foodVideo.create({
    data: { name, url, types: JSON.stringify(types ?? []) },
  })
  return NextResponse.json({ ...video, types: JSON.parse(video.types) }, { status: 201 })
}
