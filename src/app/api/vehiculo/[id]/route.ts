import { db } from '@/db'
import { Vehiculo } from '@/db/schema'
import { createApiResponse } from '@/lib/api'
import { vehicleUpdateSchema } from '@/utils/vehicle'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const GET = async (req: Request, { params }) => {
  try {
    const { id } = await params
    const vehicle = await db.select().from(Vehiculo).where(eq(Vehiculo.id, parseInt(id)))
    if (!vehicle || vehicle.length === 0) {
      return NextResponse.json(
        createApiResponse('No vehicle found', 404)
      )
    }

    return NextResponse.json(
      createApiResponse('Vehicle found', 200, vehicle)
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
    const validateBody = vehicleUpdateSchema.safeParse(body)
    if (!validateBody.success) {
      return NextResponse.json(
        createApiResponse(JSON.parse(validateBody.error.message), 400)
      )
    }
    const vehicle = await db.update(Vehiculo).set(body).where(eq(Vehiculo.id, parseInt(id)))
    return NextResponse.json(
      createApiResponse('Vehicle updated', 200, vehicle)
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
    const vehicle = await db.delete(Vehiculo).where(eq(Vehiculo.id, parseInt(id)))
    return NextResponse.json(
      createApiResponse('Vehicle ' + id + ' deleted', 200, vehicle)
    )
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      createApiResponse('Internal server error. Please try again later.', 500)
    )
  }
}
