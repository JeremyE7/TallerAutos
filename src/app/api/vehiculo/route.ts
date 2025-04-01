import { db } from '@/db'
import { Cliente, Vehiculo } from '@/db/schema'
import { createApiResponse } from '@/lib/api'
import { vehicleSchema } from '@/utils/vehicle'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const GET = async () => {
  try{
    const allVehicles = await db.query.Vehiculo.findMany({
      with: {
        cliente: true
      }
    })

    if(!allVehicles || allVehicles.length === 0){
      return NextResponse.json(
        createApiResponse('No vehicles found', 404)
      )
    }

    return NextResponse.json(
      createApiResponse('Vehicles retrieved successfully', 200, allVehicles)
    )
  }
  catch(error){
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      createApiResponse('Internal server error. Please try again later.', 500)
    )
  }
}

export const POST = async (request: Request) => {
  try{
    if(!request.body){
      return NextResponse.json(
        createApiResponse('Missing request body', 400)
      )
    }
    const body = await request.json()
    const validateBody = vehicleSchema.safeParse(body)
    if(!validateBody.success){
      return NextResponse.json(
        createApiResponse(validateBody.error.errors.at(-1)?.message ?? '', 400)
      )
    }

    //Verificar si el cliente existe
    const existingUser = await db.select().from(Cliente).where(eq(Cliente.id, validateBody.data.cliente_id))

    if(!existingUser || existingUser.length === 0){
      return NextResponse.json(
        createApiResponse('Client not found', 404)
      )
    }

    //Verificar que no haya una placa duplicada
    const existingVehicle = await db.select().from(Vehiculo).where(eq(Vehiculo.placa, validateBody.data.placa))

    if(existingVehicle && existingVehicle.length > 0){
      return NextResponse.json(
        createApiResponse('Vehicle with that plate already exists', 400)
      )
    }

    const vehicle = await db.insert(Vehiculo).values(validateBody.data).returning()

    return NextResponse.json(
      createApiResponse('Vehicle created', 201, vehicle)
    )


  }
  catch(error){
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      createApiResponse('Internal server error. Please try again later.', 500)
    )
  }
}
