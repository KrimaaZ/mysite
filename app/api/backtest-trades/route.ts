import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const trades = await prisma.backtestTrade.findMany({
    orderBy:  { createdAt: 'desc' },
    include:  { screenshots: { select: { timeframe: true } } },
  })
  const result = trades.map(({ screenshots, ...t }: { screenshots: { timeframe: string }[]; [k: string]: unknown }) => ({
    ...t,
    hasScreenshots: screenshots.map((s: { timeframe: string }) => s.timeframe),
  }))
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  const b = await req.json()
  const trade = await prisma.backtestTrade.create({
    data: {
      date:    b.date,
      type:    b.type,
      entry:   Number(b.entry),
      sl:      b.sl      ? Number(b.sl)      : null,
      tp:      b.tp      ? Number(b.tp)      : null,
      rr:      b.rr      ? Number(b.rr)      : null,
      riskPct: b.riskPct ? Number(b.riskPct) : null,
      result:  b.result  ? Number(b.result)  : null,
      comment: b.comment || null,
      flagged: false,
    },
  })
  return NextResponse.json({ ...trade, hasScreenshots: [] }, { status: 201 })
}
