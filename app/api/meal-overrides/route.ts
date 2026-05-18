import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const overrides = await prisma.mealOverride.findMany()
  // Return as a Record<mealId, override>
  const map: Record<number, object> = {}
  overrides.forEach(o => { map[o.mealId] = o })
  return NextResponse.json(map)
}

export async function PUT(req: Request) {
  const body = await req.json()
  const { mealId, ...data } = body
  const override = await prisma.mealOverride.upsert({
    where: { mealId },
    update: data,
    create: { mealId, ...data },
  })
  return NextResponse.json(override)
}
