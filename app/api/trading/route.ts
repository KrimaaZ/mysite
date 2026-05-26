import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const trades = await prisma.trade.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(trades)
}

export async function POST(req: Request) {
  const body = await req.json()
  const trade = await prisma.trade.create({
    data: {
      date:       body.date,
      instrument: body.instrument,
      type:       body.type,
      entry:      Number(body.entry),
      exit:       body.exit      ? Number(body.exit)      : null,
      size:       body.size      ? Number(body.size)      : 0,
      pnl:        body.pnl       ? Number(body.pnl)       : null,
      notes:      body.notes     || null,
      status:     body.status    || 'OPEN',
      tp:         body.tp        ? Number(body.tp)        : null,
      sl:         body.sl        ? Number(body.sl)        : null,
      riskPct:    body.riskPct   ? Number(body.riskPct)   : null,
      resultPct:  body.resultPct ? Number(body.resultPct) : null,
      rr:         body.rr        ? Number(body.rr)        : null,
      tvLinks:    body.tvLinks   || null,
    },
  })
  return NextResponse.json(trade, { status: 201 })
}
