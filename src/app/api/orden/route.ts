import { NextResponse } from 'next/server'
// import * as schema from '@/db/schema'  // Importar todo el esquema
import { db } from '@/db'
import { createApiResponse } from '@/lib/api'
import { Cliente, ElementosIngreso, Fotos, OrdenTrabajo, Vehiculo } from '@/db/schema'
import { eq } from 'drizzle-orm'


// GET: Obtener todas las órdenes
export async function GET() {
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
        createApiResponse('No orders found', 404)
      )
    }

    return NextResponse.json(
      createApiResponse('Orders retrieved successfully', 200, allOrders)
    )
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      createApiResponse('Internal server error. Please try again later.', 500)
    )
  }
}

// POST: Crear una nueva orden
export const POST = (async (request: Request) => {
  try {
    const body = await request.json()

    // Validar campos obligatorios
    const requiredFields = {
      cliente: body.cliente,
      vehiculo: body.vehiculo,
      elementosIngreso: body.elementosIngreso,
      fechaIngreso: body.fechaIngreso,
      fechaSalida: body.fechaSalida,
      forma_pago: body.forma_pago
    }

    const missingFields = Object.entries(requiredFields)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => value === undefined || value === null || value === '')
      .map(([key]) => key)

    if (missingFields.length > 0) {
      return NextResponse.json(
        createApiResponse(`Faltan campos obligatorios: ${missingFields.join(', ')}`, 400)
      )
    }


    const result = await db.transaction(async () => {
      const clienteData = body.cliente

      let existingCliente = await db.query.Cliente.findFirst({
        where: eq(Cliente.cedula, clienteData.cedula)
      })
      console.log('existingCliente:', existingCliente)
      // Verificar si el cliente ya existe por cédula
      if (existingCliente) {
        console.log('Cliente encontrado:', existingCliente)
      } else {
        console.log('Cliente no encontrado, creando nuevo cliente...')
      }

      if (!existingCliente) {
        console.log('Cliente no encontrado, creando nuevo cliente...')
        existingCliente = await db.insert(Cliente).values({
          nombre: clienteData.nombre,
          cedula: clienteData.cedula,
          direccion: clienteData.direccion || null,
          email: clienteData.email || null,
          telefono: clienteData.telefono || null
        }).returning().then(res => {
          if (!res[0]) {
            throw new Error('Failed to insert Cliente')
          }
          return res[0]
        })

        if (!existingCliente) {
          throw new Error('Cliente could not be created or retrieved.')
        }
      }


      // Verificar si el vehículo ya existe por placa
      const existingVehiculo = await db.query.Vehiculo.findFirst({
        where: (v, { eq }) => eq(v.placa, body.vehiculo.placa)
      })

      let vehiculoId: number

      if (existingVehiculo) {
        vehiculoId = existingVehiculo.id
      } else {
        const newVehiculo = await db.insert(Vehiculo).values({
          marca: body.vehiculo.marca,
          modelo: body.vehiculo.modelo || null,
          anio: body.vehiculo.anio || null,
          chasis: body.vehiculo.chasis || null,
          motor: body.vehiculo.motor || null,
          color: body.vehiculo.color || null,
          placa: body.vehiculo.placa,
          kilometraje: body.vehiculo.kilometraje || null,
          cliente_id: existingCliente.id
        }).returning()

        vehiculoId = newVehiculo[0].id
      }


      const newElementosIngreso = await db.insert(ElementosIngreso).values({
        // Excluye explícitamente el ID si existe en el body
        ...body.elementosIngreso,
        id: undefined // Esto fuerza a que la DB genere el ID
      }).returning()

      const newFotos = await db.insert(Fotos).values({
        frontal: null,
        trasera: null,
        derecha: null,
        izquierda: null,
        superior: null,
        interior: null
      }).returning()


      const newOrden = await db.insert(OrdenTrabajo).values({
        fechaIngreso: body.fechaIngreso,
        fechaSalida: body.fechaSalida,
        operaciones_solicitadas: body.operaciones_solicitadas || null,
        total_mo: body.total_mo || 0,
        total_rep: body.total_rep || 0,
        iva: body.iva || 0,
        total: body.total || 0,
        comentarios: body.comentarios || null,
        vehiculo_id: vehiculoId,
        elementos_ingreso_id: newElementosIngreso[0].id,
        forma_pago: body.forma_pago,
        fotos_id: newFotos[0].id
      }).returning()

      return {
        orden: newOrden[0],
        fotos: newFotos[0]
      }
    })
    // 2. SUBIR FOTOS A CLOUDINARY SI EXISTEN

    return NextResponse.json(
      createApiResponse('Orden creada exitosamente', 201, {
        ...result.orden,
        fotos: body.fotos || {}
      })
    )
  } catch (error) {
    console.error('Error al crear la orden:', error)
    return NextResponse.json(
      createApiResponse('Error interno del servidor', 500)
    )
  }
})

