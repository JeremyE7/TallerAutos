import { Cliente } from '@/db/schema'
import { createApiResponse } from '@/lib/api'
import { clientUpdateSchema } from '@/utils/client'
import { getById, updateById } from '@/utils/crud'
import { NextResponse } from 'next/server'
import { withHeaderValidation } from '../../utils'


export const GET = async (req: Request, { params }) => {
  const { id } = await params
  return getById(
    Cliente,
    parseInt(id),
    'No client found',
    'Client found',
    'Internal server error. Please try again later.'
  )
}

export const PUT = withHeaderValidation(async (req: Request, { params }) => {
  const { id } = await params
  const body = await req.json()

  if (body.id) {
    return NextResponse.json(
      createApiResponse('You cannot update the id', 400)
    )
  }

  return updateById(
    Cliente,
    parseInt(id),
    body,
    clientUpdateSchema,
    'Client updated',
    'La cedula ya está registrada.'
  )
})

