import { db } from '@/db'
import { Cliente } from '@/db/schema'
import { createApiResponse } from '@/lib/api'
import { clientUpdateSchema } from '@/utils/client'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { withHeaderValidation } from '../../utils'


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

export const PUT = withHeaderValidation(async (req: Request, { params }) => {
  try {
    const { id } = await params
    const body = await req.json()
    if(body.id){
      return NextResponse.json(
        createApiResponse('You cannot update the id', 400)
      )
    }
    const validateBody = clientUpdateSchema.safeParse(body)
    if (!validateBody.success) {
      return NextResponse.json(
        createApiResponse(validateBody.error.errors.at(-1)?.message ?? '', 400)
      )
    }

    const client = await db.update(Cliente).set(body).where(eq(Cliente.id, parseInt(id)))
    return NextResponse.json(
      createApiResponse('Client updated', 200, client)
    )
  } catch (error) {
    console.error('Error fetching order:', error)
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      console.error('Error: La cedula ya está registrada.')
      return NextResponse.json(
        createApiResponse('La cedula ya está registrada.', 400)
      )
    }
    return NextResponse.json(
      createApiResponse('Internal server error. Please try again later.', 500)
    )
  }
})

