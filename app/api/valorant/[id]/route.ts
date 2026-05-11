import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.valorantTip.delete({ where: { id: Number(id) } })
  return NextResponse.json({ ok: true })
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const tip = await prisma.valorantTip.update({
    where: { id: Number(id) },
    data: {
      title: body.title,
      content: body.content,
      category: body.category,
      agent: body.agent || null,
      drill: body.drill || null,
    },
  })
  return NextResponse.json(tip)
}
