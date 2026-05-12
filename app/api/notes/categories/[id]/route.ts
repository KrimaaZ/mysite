import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const cat = await prisma.noteCategory.update({ where: { id: Number(id) }, data: body })
  return NextResponse.json(cat)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.note.deleteMany({ where: { categoryId: Number(id) } })
  await prisma.noteCategory.delete({ where: { id: Number(id) } })
  return NextResponse.json({ ok: true })
}
