import { db } from '@/db'
import { Cliente, Vehiculo } from '@/db/schema'
import { createApiResponse } from '@/lib/api'
import { vehicleSchema } from '@/utils/vehicle'
import { validateRequestBody, withErrorHandler } from '@/utils/crud'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { withHeaderValidation } from '../utils'

export const GET = withErrorHandler(async () => {
  const allVehicles = await db.query.Vehiculo.findMany({
    with: {
      cliente: true
    }
  })

  if (!allVehicles || allVehicles.length === 0) {
    return NextResponse.json(
      createApiResponse('No vehicles found', 404)
    )
  }

  return NextResponse.json(
    createApiResponse('Vehicles retrieved successfully', 200, allVehicles)
  )
})

export const POST = withHeaderValidation(withErrorHandler(async (request: Request) => {
  if (!request.body) {
    return NextResponse.json(
      createApiResponse('Missing request body', 400)
    )
  }

  const body = await request.json()
  const validation = validateRequestBody(body, vehicleSchema)

  if (!validation.success) {
    console.log('Validation error in vehicle endpoint:', body)
    return validation.response
  }

  console.log('El body del vehiculo se valido:', validation.data)

  // Verificar si el cliente existe
  const existingUser = await db.select().from(Cliente).where(eq(Cliente.cedula, validation.data?.cliente?.cedula))

  if (!existingUser || existingUser.length === 0) {
    console.log('Cliente no encontrado, creando nuevo cliente')
    const newClient = await db.insert(Cliente).values(validation.data.cliente).returning()
    console.log('Nuevo cliente creado:', newClient)
    return NextResponse.json(
      createApiResponse('Client not found', 404)
    )
  }

  // Verificar que no haya una placa duplicada
  const existingVehicle = await db.select().from(Vehiculo).where(eq(Vehiculo.placa, validation.data.placa))

  if (existingVehicle && existingVehicle.length > 0) {
    return NextResponse.json(
      createApiResponse('Vehicle with that plate already exists', 200, existingVehicle)
    )
  }

  const vehicle = await db.insert(Vehiculo).values(validation.data[0]).returning()

  return NextResponse.json(
    createApiResponse('Vehicle created', 200, vehicle)
  )
}))
