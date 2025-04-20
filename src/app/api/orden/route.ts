import { db } from '@/db'
import { createApiResponse } from '@/lib/api'
import { NextResponse } from 'next/server'
import { withHeaderValidation } from '../utils'
import { createOrderSchema } from '@/utils/orders'
import { eq } from 'drizzle-orm'
import { Cliente, Vehiculo, OrdenTrabajo, ElementosIngreso, Fotos } from '@/db/schema'

export const POST = withHeaderValidation(async (request: Request) => {
  try {
    if(!request.body){
      return NextResponse.json(
        createApiResponse('Missing request body', 400)
      )
    }

    const body = await request.json()
    console.log('body:', body)

    const validatedBody = createOrderSchema.safeParse(body)
    if (!validatedBody.success) {
      console.log('Validation error:', validatedBody.error.errors)

      return NextResponse.json(
        createApiResponse(validatedBody.error.errors.at(-1)?.message ?? '', 400)
      )
    }

    const { vehiculo, elementosIngreso, foto } = validatedBody.data

    //Verificamos si el vehiculo existe
    let existingVehicle = await db.query.Vehiculo.findFirst({
      where: eq(Vehiculo.placa, vehiculo.placa)
    })

    if (!existingVehicle) {
      // Si el vehículo no existe, lo creamos
      // Extract or create cliente_id from the cliente object
      const clienteAux = vehiculo.cliente
      const existingCliente = await db.query.Cliente.findFirst({
        where: eq(Cliente.cedula, clienteAux.cedula)
      })

      let cliente_id: number
      if (!existingCliente) {
        const newCliente = await db.insert(Cliente).values(clienteAux).returning()
        cliente_id = newCliente[0].id
      } else {
        cliente_id = existingCliente.id
      }

      // Add cliente_id to vehiculo object
      const { cliente, id, ...vehiculoWithoutCliente } = vehiculo
      console.log('cliente', id, cliente)

      const vehiculoWithClienteId = { ...vehiculoWithoutCliente, cliente_id }
      console.log('vehiculoWithClienteId', vehiculoWithClienteId)


      const newVehicle = await db.insert(Vehiculo).values(vehiculoWithClienteId).returning()
      existingVehicle = newVehicle[0]
    }

    //Crear elementos de ingreso y fotos
    const { id, ...elementosIngresoWithoutId } = elementosIngreso
    console.log(id)
    const newElementsIngreso = await db.insert(ElementosIngreso).values(elementosIngresoWithoutId).returning()

    if (!foto) {
      throw new Error('Foto data is missing')
    }
    const { id: idFoto, ...fotoWithoutId } = foto
    console.log('fotoWithoutId:', idFoto)
    const newFoto = await db.insert(Fotos).values(fotoWithoutId).returning()

    // Crear la orden de trabajo
    const orderData = {
      ...validatedBody.data,
      vehiculo_id: existingVehicle.id,
      elementos_ingreso_id: newElementsIngreso[0].id,
      fotos_id: newFoto[0].id
    }

    const { id: orderId, ...orderWithoutId } = orderData
    console.log('orderWithoutId:', orderId)
    const newOrder = await db.insert(OrdenTrabajo).values(orderWithoutId).returning()
    const createdOrder = newOrder[0]

    const cliente = await db.query.Cliente.findFirst({
      where: eq(Cliente.id, existingVehicle.cliente_id)
    })

    // Devolver la orden creada
    return NextResponse.json(
      createApiResponse('Orden creada exitosamente', 200, {...createdOrder, vehiculo: {...existingVehicle, cliente: cliente}, elementosIngreso: newElementsIngreso[0], foto: newFoto[0]})
    )

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      createApiResponse('Hubo un error al crear la orden, porfavor intente despues', 500)
    )
  }
})

// GET: Obtener todas las órdenes
export async function GET () {
  try {
    const allOrders = await db.query.OrdenTrabajo.findMany({
      with: {
        vehiculo: {
          with: {
            cliente: true
          }
        },
        elementosIngreso: true,
        foto: true
      }
    })

    if (!allOrders || allOrders.length === 0) {
      return NextResponse.json(
        createApiResponse('No se encontraron ordenes', 404)
      )
    }

    return NextResponse.json(
      createApiResponse('Orders retrieved successfully', 200, allOrders)
    )
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      createApiResponse('Hubo un erro interno en el servidor, porfavor intente despues.', 500)
    )
  }
}

