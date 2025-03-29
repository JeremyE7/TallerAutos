import { NextResponse } from 'next/server'
// import * as schema from '@/db/schema'  // Importar todo el esquema
import { db } from '@/db'
import { createApiResponse } from '@/lib/api'
import { Cliente, ElementosIngreso, Fotos, OrdenTrabajo, Vehiculo } from '@/db/schema'
// Configurar Cloudinary


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
export async function POST (request: Request) {
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
        combustible: body.elementosIngreso.combustible || false
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
}
