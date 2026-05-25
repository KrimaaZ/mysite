import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const KEY = 'personal-notes'

export async function GET() {
  const row = await prisma.appPreference.findUnique({ where: { key: KEY } })
  return NextResponse.json({ content: row?.value ?? '' })
}

export async function PUT(req: Request) {
  const { content } = await req.json()
  const row = await prisma.appPreference.upsert({
    where:  { key: KEY },
    update: { value: content },
    create: { key: KEY, value: content },
  })
  return NextResponse.json({ content: row.value })
}
