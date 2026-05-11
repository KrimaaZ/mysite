import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const recipe = await prisma.recipe.findUnique({ where: { id: Number(id) } })
  if (!recipe) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(recipe)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const recipe = await prisma.recipe.update({
    where: { id: Number(id) },
    data: {
      title: body.title,
      description: body.description,
      ingredients: JSON.stringify(body.ingredients),
      instructions: body.instructions,
      prepTime: Number(body.prepTime),
      cookTime: Number(body.cookTime),
      servings: Number(body.servings),
      category: body.category,
    },
  })
  return NextResponse.json(recipe)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.recipe.delete({ where: { id: Number(id) } })
  return NextResponse.json({ ok: true })
}
