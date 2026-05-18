import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const catId = searchParams.get('categoryId')
  const notes = await prisma.note.findMany({
    where: catId ? { categoryId: Number(catId) } : undefined,
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(notes)
}

export async function POST(req: Request) {
  const body = await req.json()
  const note = await prisma.note.create({
    data: { categoryId: Number(body.categoryId), title: body.title, rules: body.rules || '', examples: body.examples || '', quiz: body.quiz || null }
  })
  return NextResponse.json(note, { status: 201 })
}
