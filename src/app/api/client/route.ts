import { Cliente as ClienteType } from '@/app/types'
import { db } from '@/db'
import { Cliente } from '@/db/schema'
import { createApiResponse } from '@/lib/api'
import { clientSchema } from '@/utils/client'
import { validateRequestBody, withErrorHandler } from '@/utils/crud'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { withHeaderValidation } from '../utils'

export const GET = withHeaderValidation(withErrorHandler(async () => {
  // Consultamos todos los clientes, incluyendo los vehiculos relacionados
  const allClients = await db.query.Cliente.findMany({
    with: {
      vehiculos: true
    }
  })

  // Si no encontramos clientes, devolvemos un error
  if (!allClients || allClients.length === 0) {
    return NextResponse.json(createApiResponse('No clients found', 404))
  }

  // Si encontramos clientes, los devolvemos en la respuesta
  return NextResponse.json(
    createApiResponse('Clients retrieved successfully', 200, allClients)
  )
}))

export const POST = withHeaderValidation(withErrorHandler(async (request: Request) => {
  if (!request.body) {
    return NextResponse.json(
      createApiResponse('Missing request body', 400)
    )
  }

  const body: ClienteType = await request.json()
  const validation = validateRequestBody(body, clientSchema)

  if (!validation.success) {
    return validation.response
  }

  const existingClient = await db.query.Cliente.findFirst({
    where: eq(Cliente.cedula, body.cedula)
  })

  if (existingClient) {
    return NextResponse.json(
      createApiResponse('Client already exists', 400)
    )
  }

  await db.insert(Cliente).values(body)
  return NextResponse.json(createApiResponse('Client created successfully', 200))
}))
