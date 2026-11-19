import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tradeId   = parseInt(searchParams.get('tradeId') || '0')
  const timeframe = searchParams.get('timeframe') || ''
  const sc = await prisma.backtestScreenshot.findUnique({
    where: { tradeId_timeframe: { tradeId, timeframe } },
  })
  return NextResponse.json(sc)
}

export async function POST(req: Request) {
  const { tradeId, timeframe, imageData } = await req.json()
  const sc = await prisma.backtestScreenshot.upsert({
    where:  { tradeId_timeframe: { tradeId, timeframe } },
    update: { imageData },
    create: { tradeId, timeframe, imageData },
  })
  return NextResponse.json(sc, { status: 201 })
}

export async function DELETE(req: Request) {
  const { tradeId, timeframe } = await req.json()
  await prisma.backtestScreenshot.deleteMany({ where: { tradeId, timeframe } })
  return NextResponse.json({ ok: true })
}
