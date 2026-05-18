import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/preferences?keys=hiddenMeals,favoriteMeals,...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const keys = searchParams.get('keys')?.split(',') ?? []
  const rows = await prisma.appPreference.findMany({ where: { key: { in: keys } } })
  const result: Record<string, string> = {}
  rows.forEach(r => { result[r.key] = r.value })
  return NextResponse.json(result)
}

// PUT /api/preferences  body: { key, value }
export async function PUT(req: Request) {
  const { key, value } = await req.json()
  const row = await prisma.appPreference.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  })
  return NextResponse.json(row)
}
