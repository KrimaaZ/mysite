import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.vaultEntry.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ ok: true })
}
