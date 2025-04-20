import { Cliente as ClienteType } from '@/app/types'
import { db } from '@/db'
import { Cliente } from '@/db/schema'
import { createApiResponse } from '@/lib/api'
import { clientSchema } from '@/utils/client'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { withHeaderValidation } from '../utils'

export const GET = withHeaderValidation(async () => {  // Aquí envolvemos el handler GET
  try {
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
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(createApiResponse('Internal server error. Please try again later.', 500))
  }
})

export const POST = withHeaderValidation(async (request: Request) => {
  try{
    if(!request.body){
      return NextResponse.json(
        createApiResponse('Missing request body', 400)
      )
    }
    const body:ClienteType = await request.json()
    const validateBody = clientSchema.safeParse(body)
    if(!validateBody.success){
      return NextResponse.json(
        createApiResponse(validateBody.error.errors.at(-1)?.message ?? '', 400)
      )
    }

    const existingClient = await db.query.Cliente.findFirst({
      where: eq(Cliente.cedula, body.cedula)
    })

    if(existingClient){
      return NextResponse.json(
        createApiResponse('Client already exists', 400)
      )
    }

    await db.insert(Cliente).values(body)
    return NextResponse.json(createApiResponse('Client created successfully', 200))

  }catch(error: unknown){
    console.error('Error creating client:', error)
    return NextResponse.json(
      createApiResponse('Internal server error. Please try again later.', 500)
    )
  }
})
