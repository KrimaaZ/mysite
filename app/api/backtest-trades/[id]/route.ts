import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const b = await req.json()
  const trade = await prisma.backtestTrade.update({
    where: { id: Number(id) },
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
      flagged: b.flagged ?? false,
    },
    include: { screenshots: { select: { timeframe: true } } },
  })
  const { screenshots, ...rest } = trade
  return NextResponse.json({ ...rest, hasScreenshots: screenshots.map((s: { timeframe: string }) => s.timeframe) })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.backtestTrade.delete({ where: { id: Number(id) } })
  return NextResponse.json({ ok: true })
}
