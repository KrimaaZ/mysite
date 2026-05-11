import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.workoutSession.delete({ where: { id: Number(id) } })
  return NextResponse.json({ ok: true })
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const session = await prisma.workoutSession.update({
    where: { id: Number(id) },
    data: {
      type: body.type,
      title: body.title,
      date: body.date,
      exercises: JSON.stringify(body.exercises),
      notes: body.notes || null,
    },
  })
  return NextResponse.json(session)
}
