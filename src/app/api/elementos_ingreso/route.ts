import { ElementosIngreso } from '@/db/schema'
import { withHeaderValidation } from '../utils'
import { db } from '@/db'
import { createApiResponse } from '@/lib/api'
import { NextResponse } from 'next/server'
export const POST = withHeaderValidation(async (req: Request) => {
  try {
    const body = await req.json()

    // Eliminar el campo 'id' del body si está presente
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...bodyWithoutId } = body

    const res = await db.insert(ElementosIngreso).values(bodyWithoutId).returning()
    return NextResponse.json(createApiResponse('Elementos creados', 200, res))
  } catch (error) {
    console.error('Error creating Elementos ingreso:', error)
    return NextResponse.json(createApiResponse('Error al crear', 500))
  }
})

