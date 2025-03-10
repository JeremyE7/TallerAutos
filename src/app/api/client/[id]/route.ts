import { db } from '@/db'
import { Cliente } from '@/db/schema'
import { createApiResponse } from '@/lib/api'
import { clientUpdateSchema } from '@/utils/client'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'


export const GET = async (req: Request, { params }) => {
  try {
    const { id } = await params
    const client = await db.select().from(Cliente).where(eq(Cliente.id, parseInt(id)))
    if (!client || client.length === 0) {
      return NextResponse.json(
        createApiResponse('No client found', 404)
      )
    }

    return NextResponse.json(
      createApiResponse('Client found', 200, client)
    )
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      createApiResponse('Internal server error. Please try again later.', 500)
    )
  }
}

export const PUT = async (req: Request, { params }) => {
  try {
    const { id } = await params
    const body = await req.json()
    const validateBody = clientUpdateSchema.safeParse(body)
    if (!validateBody.success) {
      return NextResponse.json(
        createApiResponse(JSON.parse(validateBody.error.message), 400)
      )
    }
    const client = await db.update(Cliente).set(body).where(eq(Cliente.id, parseInt(id)))
    return NextResponse.json(
      createApiResponse('Client updated', 200, client)
    )
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      createApiResponse('Internal server error. Please try again later.', 500)
    )
  }
}

export const DELETE = async (req: Request, { params }) => {
  try {
    const { id } = await params
    const client = await db.delete(Cliente).where(eq(Cliente.id, parseInt(id)))
    return NextResponse.json(
      createApiResponse('Client ' + id + ' deleted', 200, client)
    )
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      createApiResponse('Internal server error. Please try again later.', 500)
    )
  }
}

