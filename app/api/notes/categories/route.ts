import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const cats = await prisma.noteCategory.findMany({ orderBy: { createdAt: 'asc' } })
  return NextResponse.json(cats)
}

export async function POST(req: Request) {
  const body = await req.json()
  const cat = await prisma.noteCategory.create({
    data: { name: body.name, color: body.color || '#2d6a4f', emoji: body.emoji || '📝' }
  })
  return NextResponse.json(cat, { status: 201 })
}
