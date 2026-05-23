import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const row = await prisma.preTradeState.findUnique({ where: { id: 1 } })
  return NextResponse.json({ data: row?.data ?? '{}' })
}

export async function PUT(req: Request) {
  const { data } = await req.json()
  const row = await prisma.preTradeState.upsert({
    where:  { id: 1 },
    update: { data },
    create: { id: 1, data },
  })
  return NextResponse.json({ data: row.data })
}
