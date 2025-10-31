import { ElementosIngreso } from '@/db/schema'
import { withHeaderValidation } from '../utils'
import { db } from '@/db'
import { createApiResponse } from '@/lib/api'
import { NextResponse } from 'next/server'
import { withErrorHandler } from '@/utils/crud'

export const POST = withHeaderValidation(withErrorHandler(async (req: Request) => {
  const body = await req.json()

  // Eliminar el campo 'id' del body si está presente
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...bodyWithoutId } = body

  const res = await db.insert(ElementosIngreso).values(bodyWithoutId).returning()
  return NextResponse.json(createApiResponse('Elementos creados', 200, res))
}))

