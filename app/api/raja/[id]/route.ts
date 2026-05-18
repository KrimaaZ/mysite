import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await req.json()
  const photo = await prisma.rajaPhoto.update({ where: { id: Number(id) }, data })
  return NextResponse.json(photo)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.rajaPhoto.delete({ where: { id: Number(id) } })
  return NextResponse.json({ ok: true })
}
