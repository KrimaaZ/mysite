import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.backtestStrategy.delete({ where: { id: Number(id) } })
  return NextResponse.json({ ok: true })
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const strategy = await prisma.backtestStrategy.update({
    where: { id: Number(id) },
    data: {
      name: body.name,
      description: body.description,
      rules: JSON.stringify(body.rules),
      timeframe: body.timeframe,
      winRate: body.winRate ? Number(body.winRate) : null,
      riskReward: body.riskReward ? Number(body.riskReward) : null,
      notes: body.notes || null,
    },
  })
  return NextResponse.json(strategy)
}
