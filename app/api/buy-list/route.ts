import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const row = await prisma.buyListData.findUnique({ where: { id: 1 } })
  return NextResponse.json({ items: row?.items ?? '[]' })
}

export async function PUT(req: Request) {
  const { items } = await req.json()
  const row = await prisma.buyListData.upsert({
    where: { id: 1 },
    update: { items },
    create: { id: 1, items },
  })
  return NextResponse.json({ items: row.items })
}
