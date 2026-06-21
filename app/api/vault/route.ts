import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const entries = await prisma.vaultEntry.findMany({ orderBy: { createdAt: 'asc' } })
  return NextResponse.json(entries)
}

export async function POST(req: Request) {
  const { app, login, password } = await req.json()
  if (!app || !login || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const entry = await prisma.vaultEntry.create({ data: { app, login, password } })
  return NextResponse.json(entry)
}
