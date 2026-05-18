import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const photos = await prisma.rajaPhoto.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(photos)
}

export async function POST(req: Request) {
  const { title, year, imageData } = await req.json()
  const photo = await prisma.rajaPhoto.create({ data: { title, year, imageData } })
  return NextResponse.json(photo, { status: 201 })
}
