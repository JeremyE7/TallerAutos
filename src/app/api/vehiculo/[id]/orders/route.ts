import { db } from '@/db'
import { OrdenTrabajo } from '@/db/schema'
import { createApiResponse } from '@/lib/api'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const GET = async (req: Request, { params }) => {
  try {
    const { id } = await params
    const orders = await db.select().from(OrdenTrabajo).where(eq(OrdenTrabajo.vehiculo_id, parseInt(id)))
    if (!orders || orders.length === 0) {
      return NextResponse.json(
        createApiResponse('No orders found', 404)
      )
    }

    return NextResponse.json(
      createApiResponse('Orders found', 200, orders)
    )
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      createApiResponse('Internal server error. Please try again later.', 500)
    )
  }
}
