import { db } from '@/db'
import { NextResponse } from 'next/server'
import { createApiResponse } from '@/lib/api'
import { ElementosIngreso } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { withHeaderValidation } from '../../utils'


// obtener una orden por su id de param
export async function GET (req: Request, { params }) {
  try {
    const { id } = await params
    const elementoIngreso = await db.select().from(ElementosIngreso).where(eq(ElementosIngreso.id, parseInt(id)))
    if (!elementoIngreso) {
      return NextResponse.json(
        createApiResponse('No se encontro los elementos de ingreso', 404)
      )
    }
    return NextResponse.json(
      createApiResponse('Elementos de Ingreso encontrado', 200, elementoIngreso)
    )
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      createApiResponse('lementos de Ingreso no encontrado', 500)
    )
  }
}

// Actualizar una orden por su id de param
export const PUT = withHeaderValidation(async (req: Request, { params }) => {
  try {
    const { id } = await params
    const body = await req.json()
    const orden = await db.update(ElementosIngreso).set(body).where(eq(ElementosIngreso.id, parseInt(id))).returning()
    return NextResponse.json(
      createApiResponse('Elementos de Ingreso actualizados', 200, orden)
    )
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      createApiResponse('Elementos de Ingreso no encontrados', 500)
    )
  }
})

// Eliminar una orden por su id de param
export const DELETE = withHeaderValidation(async (req: Request, { params }) => {
  try {
    const { id } = await params
    const orden = await db.delete(ElementosIngreso).where(eq(ElementosIngreso.id, parseInt(id)))
    return NextResponse.json(
      createApiResponse('Elementos de Ingreso ' + id + ' eliminados', 200, orden)
    )
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      createApiResponse('Orden no encontrada', 500)
    )
  }
})
