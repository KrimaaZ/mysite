import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { login, password } = await req.json()
  if (login === 'admin' && password === 'admin1996') {
    return NextResponse.json({ ok: true, token: 'vault-session-ok' })
  }
  return NextResponse.json({ ok: false }, { status: 401 })
}
