import { db } from '@/db'
import { OrdenTrabajo, Vehiculo, ElementosIngreso, Fotos } from '@/db/schema'
import { createApiResponse } from '@/lib/api'
import { orderSchema } from '@/utils/orders'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { withHeaderValidation } from '../utils'
export const POST = withHeaderValidation(async (request: Request) => {
  console.log('1 asdasdasd asdas Body: aqui en el endpoint de orden')
  try {
    if (!request.body) {
      return NextResponse.json(createApiResponse('Missing request body', 400))
    }
    console.log('2 Body: aqui en el endpoint de orden')

    const body = await request.json()
    console.log('Body: aqui en el endpoint de orden', body)
    const validate = orderSchema.safeParse(body)
    if (!validate.success) {
      console.log('Validation error in order endpoint:', validate.error.errors, body)
      return NextResponse.json(
        createApiResponse(validate.error.toString() ?? '', 400)
      )
    }

    const data = validate.data
    console.log('El body de la orden se valido:', data)
    // Verificar existencia de vehículo, elementos y foto
    console.log('DATOS ENCONTRADOS')
    const vehiculo = await db.select().from(Vehiculo).where(eq(Vehiculo.id, parseInt(data.vehiculo_id.toString())))
    const elementos = await db.select().from(ElementosIngreso).where(eq(ElementosIngreso.id, parseInt(data.elementos_ingreso_id.toString())))
    const foto = await db.select().from(Fotos).where(eq(Fotos.id, parseInt(data.fotos_id.toString())))
    console.log('Vehiculo:', vehiculo)
    console.log('Elementos:', elementos)
    console.log('Foto:', foto)
    if (vehiculo.length === 0) {
      console.log('Vehículo no encontrado, creando nuevo vehículo')
      await db.insert(Vehiculo).values(vehiculo).returning()
    }

    if (elementos.length === 0) {
      console.log('Elementos de ingreso no encontrados, creando nuevos elementos')
      await db.insert(ElementosIngreso).values(elementos).returning()
    }

    if (foto.length === 0) {
      console.log('Foto no encontrada, creando nueva foto')
      await db.insert(Fotos).values(foto).returning()
    }
    console.log('3 Body: aqui en el endpoint de orden')
    const newOrder = await db.insert(OrdenTrabajo).values(data).returning()

    return NextResponse.json(createApiResponse('Orden creada con éxito', 200, newOrder))
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      createApiResponse('Internal server error. Please try again later.', 500)
    )
  }
})
/*
export const POST = (async (request: Request) => {
  try {
    if (!request.body) {
      return NextResponse.json(
        createApiResponse('Missing request body', 400)
      )
    }

    const body = await request.json()
    const validateBody = orderSchema.safeParse(body)

    if (!validateBody.success) {
      return NextResponse.json(
        createApiResponse(validateBody.error.errors.at(-1)?.message ?? '', 400)
      )
    }

    const {
      vehiculo_id,
      elementos_ingreso_id,
      fotos_id
    } = validateBody.data

    // Verificar existencia de Vehículo
    const vehiculo = await db.select().from(Vehiculo).where(eq(Vehiculo.id, vehiculo_id))
    if (vehiculo.length === 0) {
      return NextResponse.json(
        createApiResponse('Vehicle not found', 404)
      )
    }

    // Verificar existencia de ElementosIngreso
    const elementos = await db.select().from(ElementosIngreso).where(eq(ElementosIngreso.id, elementos_ingreso_id))
    if (elementos.length === 0) {
      return NextResponse.json(
        createApiResponse('Entry elements not found', 404)
      )
    }

    // Verificar existencia de Fotos
    const fotos = await db.select().from(Fotos).where(eq(Fotos.id, fotos_id))
    if (fotos.length === 0) {
      return NextResponse.json(
        createApiResponse('Photos not found', 404)
      )
    }

    const orden = await db.insert(OrdenTrabajo).values(validateBody.data).returning()

    return NextResponse.json(
      createApiResponse('Work order created', 201, orden)
    )

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      createApiResponse('Internal server error. Please try again later.', 500)
    )
  }
})*/

// POST: Crear una nueva orden
/*export const POST = (async (request: Request) => {
  try {
    const body = await request.json()

    // Validar campos obligatorios
    if (
      !body.cliente ||
      !body.vehiculo ||
      !body.elementosIngreso ||
      !body.fechaIngreso ||
      !body.fechaSalida ||
      !body.forma_pago
    ) {
      return NextResponse.json(createApiResponse('Faltan campos obligatorios', 400))
    }

    const result = await db.transaction(async (tx) => {
      // Verificar si el cliente ya existe
      let existingCliente = await tx.query.Cliente.findFirst({
        where: (c, { eq }) => eq(c.cedula, body.cliente.cedula)
      })

      if (!existingCliente) {
        existingCliente = await tx.insert(Cliente).values({
          nombre: body.cliente.nombre,
          cedula: body.cliente.cedula,
          direccion: body.cliente.direccion || null,
          email: body.cliente.email || null,
          telefono: body.cliente.telefono || null
        }).returning().then(res => res[0])
      }

      const newVehiculo = await tx.insert(Vehiculo).values({
        marca: body.vehiculo.marca,
        modelo: body.vehiculo.modelo || null,
        anio: body.vehiculo.anio || null,
        chasis: body.vehiculo.chasis || null,
        motor: body.vehiculo.motor || null,
        color: body.vehiculo.color || null,
        placa: body.vehiculo.placa,
        kilometraje: body.vehiculo.kilometraje || null,
        cliente_id: existingCliente ? existingCliente.id : 0 // or any default value
      }).returning()

      const newElementosIngreso = await tx.insert(ElementosIngreso).values({
        limpiaparabrisas: body.elementosIngreso.limpiaparabrisas || false,
        espejos: body.elementosIngreso.espejos || false,
        luces: body.elementosIngreso.luces || false,
        placas: body.elementosIngreso.placas || false,
        emblemas: body.elementosIngreso.emblemas || false,
        radio: body.elementosIngreso.radio || false,
        control_alarma: body.elementosIngreso.control_alarma || false,
        tapetes: body.elementosIngreso.tapetes || false,
        aire_acondicionado: body.elementosIngreso.aire_acondicionado || false,
        matricula: body.elementosIngreso.matricula || false,
        herramientas: body.elementosIngreso.herramientas || false,
        tuerca_seguridad: body.elementosIngreso.tuerca_seguridad || false,
        gata: body.elementosIngreso.gata || false,
        llave_ruedas: body.elementosIngreso.llave_ruedas || false,
        extintor: body.elementosIngreso.extintor || false,
        encendedor: body.elementosIngreso.encendedor || false,
        antena: body.elementosIngreso.antena || false,
        llanta_emergencia: body.elementosIngreso.llanta_emergencia || false,
        combustible: body.elementosIngreso.combustible || 0
      }).returning()

      const newFotos = await tx.insert(Fotos).values({
        frontal: body.fotos.frontal || null,
        trasera: body.fotos.trasera || null,
        derecha: body.fotos.derecha || null,
        izquierda: body.fotos.izquierda || null,
        superior: body.fotos.superior || null
      }).returning()

      const newOrden = await tx.insert(OrdenTrabajo).values({
        fechaIngreso: body.fechaIngreso,
        fechaSalida: body.fechaSalida,
        operaciones_solicitadas: body.operaciones_solicitadas || null,
        total_mo: body.total_mo || 0,
        total_rep: body.total_rep || 0,
        iva: body.iva || 0,
        total: body.total || 0,
        comentarios: body.comentarios || null,
        vehiculo_id: newVehiculo[0].id,
        elementos_ingreso_id: newElementosIngreso[0].id,
        forma_pago: body.forma_pago,
        fotos_id: newFotos[0].id
      }).returning()

      return newOrden
    })

    return NextResponse.json(createApiResponse('Orden creada exitosamente', 201, result))
  } catch (error) {
    console.error('Error al crear la orden:', error)
    return NextResponse.json(createApiResponse('Error interno del servidor', 500))
  }
})
*/
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

