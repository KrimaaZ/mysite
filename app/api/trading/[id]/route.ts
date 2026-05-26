import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const trade = await prisma.trade.update({
    where: { id: Number(id) },
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
  return NextResponse.json(trade)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.trade.delete({ where: { id: Number(id) } })
  return NextResponse.json({ ok: true })
}
