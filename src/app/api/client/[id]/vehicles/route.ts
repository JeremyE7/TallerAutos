import { db } from '@/db'
import { Vehiculo } from '@/db/schema'
import { createApiResponse } from '@/lib/api'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const GET = async (req: Request, { params }) => {
  try {
    const { id } = await params
    const vehicle = await db.select().from(Vehiculo).where(eq(Vehiculo.cliente_id, parseInt(id)))
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
