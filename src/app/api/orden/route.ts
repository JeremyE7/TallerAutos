import { NextResponse } from 'next/server';
import tursoClient from '@/lib/turso';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Obtener todas las órdenes
export async function GET() {
    try {
        const result = await tursoClient.execute(`
      SELECT 
        OrdenTrabajo.*, 
        Vehiculo.*, 
        Cliente.*,
        ElementosIngreso.*,
        Fotos.*
      FROM OrdenTrabajo
      INNER JOIN Vehiculo ON OrdenTrabajo.vehiculo_id = Vehiculo.id
      INNER JOIN Cliente ON Vehiculo.cliente_id = Cliente.id
      INNER JOIN ElementosIngreso ON OrdenTrabajo.elementos_ingreso_id = ElementosIngreso.id
      INNER JOIN Fotos ON OrdenTrabajo.fotos_id = Fotos.id;
    `);

        // Procesar los resultados para formate ar la respuesta
        const orders = result.rows.map((row) => {
            const cliente = {
                id: row.cliente_id,
                nombre: row.nombre,
                cedula: row.cedula,
                direccion: row.direccion,
                email: row.email,
                telefono: row.telefono,
            };

            const vehiculo = {
                id: row.vehiculo_id,
                marca: row.marca,
                modelo: row.modelo,
                anio: row.anio,
                chasis: row.chasis,
                motor: row.motor,
                color: row.color,
                placa: row.placa,
                kilometraje: row.kilometraje,
                combustible: row.combustible,
            };

            const elementos_ingreso = {
                id: row.elementos_ingreso_id,
                limpiaparabrisas: row.limpiaparabrisas,
                espejos: row.espejos,
                luces: row.luces,
                placas: row.placas,
                emblemas: row.emblemas,
                radio: row.radio,
                control_alarma: row.control_alarma,
                tapetes: row.tapetes,
                aire_acondicionado: row.aire_acondicionado,
                matricula: row.matricula,
                herramientas: row.herramientas,
                tuerca_seguridad: row.tuerca_seguridad,
                gata: row.gata,
                llave_ruedas: row.llave_ruedas,
                extintor: row.extintor,
                encendedor: row.encendedor,
                antena: row.antena,
                llanta_emergencia: row.llanta_emergencia,
            };
            const fotos = {
                id: row.fotos_id,
                frontal: row.frontal,
                trasera: row.trasera,
                derecha: row.derecha,
                izquierda: row.izquierda,
                interior: row.interior,
            };

            // Formatear la respuesta
            const { cliente_id, vehiculo_id, elementos_ingreso_id, fotos_id, nombre, cedula, direccion, email, telefono, marca, modelo, anio, chasis, motor, color, placa, kilometraje, combustible, limpiaparabrisas, espejos, luces, placas: placasVehiculo, emblemas, radio, control_alarma, tapetes, aire_acondicionado, matricula, herramientas, tuerca_seguridad, gata, llave_ruedas, extintor, encendedor, antena, llanta_emergencia, izquierda, derecha, frontal, trasera, superior, interior, ...orden } = row;
            return {
                ...orden,
                Cliente: cliente,
                Vehiculo: vehiculo,
                ElementosIngreso: elementos_ingreso,
                Fotos: fotos,
            };
        });
        return NextResponse.json({ data: orders });
    } catch (error) {
        console.error('Error al obtener las órdenes:', error);
        return NextResponse.json(
            { error: 'Error al obtener las órdenes' },
            { status: 500 }
        );
    }
}

// POST: Crear una nueva orden

export async function POST(request: Request) {
    try {
        // Obtener el cuerpo de la solicitud
        const body = await request.json();

        // Validar el cuerpo de la solicitud
        if (
            !body.cliente ||
            !body.vehiculo ||
            !body.elementosIngreso ||
            !body.fotos ||
            !body.fechaIngreso ||
            !body.fechaSalida ||
            !body.forma_pago
        ) {
            return NextResponse.json(
                { error: 'Faltan campos obligatorios' },
                { status: 400 }
            );
        }

        // Iniciar una transacción
        const transaction = await tursoClient.transaction();

        try {
            // Paso 1: Insertar o obtener el cliente
            let clienteId: number;
            const existingCliente = await transaction.execute({
                sql: 'SELECT id FROM Cliente WHERE cedula = ?',
                args: [body.cliente.cedula],
            });

            if (existingCliente.rows.length > 0) {
                clienteId = existingCliente.rows[0].id as number;
            } else {
                const newCliente = await transaction.execute({
                    sql: `
            INSERT INTO Cliente (nombre, cedula, direccion, email, telefono)
            VALUES (?, ?, ?, ?, ?)
          `,
                    args: [
                        body.cliente.nombre,
                        body.cliente.cedula,
                        body.cliente.direccion || null,
                        body.cliente.email || null,
                        body.cliente.telefono || null,
                    ],
                });
                clienteId = newCliente.lastInsertRowid as unknown as number;
            }

            // Paso 2: Insertar el vehículo
            const newVehiculo = await transaction.execute({
                sql: `
          INSERT INTO Vehiculo (
            marca, modelo, anio, chasis, motor, color, placa, kilometraje, combustible, cliente_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
                args: [
                    body.vehiculo.marca,
                    body.vehiculo.modelo || null,
                    body.vehiculo.anio || null,
                    body.vehiculo.chasis || null,
                    body.vehiculo.motor || null,
                    body.vehiculo.color || null,
                    body.vehiculo.placa,
                    body.vehiculo.kilometraje || null,
                    body.vehiculo.combustible || null,
                    clienteId,
                ],
            });
            const vehiculoId = newVehiculo.lastInsertRowid as unknown as number;

            // Paso 3: Insertar elementos de ingreso
            const newElementosIngreso = await transaction.execute({
                sql: `
          INSERT INTO ElementosIngreso (
            limpiaparabrisas, espejos, luces, placas, emblemas, radio, control_alarma, tapetes,
            aire_acondicionado, matricula, herramientas, tuerca_seguridad, gata, llave_ruedas,
            extintor, encendedor, antena, llanta_emergencia
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
                args: [
                    body.elementosIngreso.limpiaparabrisas || false,
                    body.elementosIngreso.espejos || false,
                    body.elementosIngreso.luces || false,
                    body.elementosIngreso.placas || false,
                    body.elementosIngreso.emblemas || false,
                    body.elementosIngreso.radio || false,
                    body.elementosIngreso.control_alarma || false,
                    body.elementosIngreso.tapetes || false,
                    body.elementosIngreso.aire_acondicionado || false,
                    body.elementosIngreso.matricula || false,
                    body.elementosIngreso.herramientas || false,
                    body.elementosIngreso.tuerca_seguridad || false,
                    body.elementosIngreso.gata || false,
                    body.elementosIngreso.llave_ruedas || false,
                    body.elementosIngreso.extintor || false,
                    body.elementosIngreso.encendedor || false,
                    body.elementosIngreso.antena || false,
                    body.elementosIngreso.llanta_emergencia || false,
                ],
            });
            const elementosIngresoId = newElementosIngreso.lastInsertRowid as unknown as number;

            // Paso 5: Insertar las fotos
            const newFotos = await transaction.execute({
                sql: `
            INSERT INTO Fotos (
              frontal, trasera, derecha, izquierda, superior
            ) VALUES (?, ?, ?, ?, ?)
          `,
                args: [
                    body.fotos.frontal || null,
                    body.fotos.trasera || null,
                    body.fotos.derecha || null,
                    body.fotos.izquierda || null,
                    body.fotos.superior || null,
                ],
            });
            const fotosID = newFotos.lastInsertRowid as unknown as number;
            // Paso 4: Insertar la orden de trabajo
            const newOrden = await transaction.execute({
                sql: `
          INSERT INTO OrdenTrabajo (
            fechaIngreso, fechaSalida, operaciones_solicitadas, total_mo, total_rep,
            iva, total, comentarios, vehiculo_id, elementos_ingreso_id, forma_pago, fotos_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
                args: [
                    body.fechaIngreso,
                    body.fechaSalida,
                    body.operaciones_solicitadas || null,
                    body.total_mo || 0,
                    body.total_rep || 0,
                    body.iva || 0,
                    body.total || 0,
                    body.comentarios || null,
                    vehiculoId,
                    elementosIngresoId,
                    body.forma_pago,
                    fotosID,
                ],
            });
            const ordenId = newOrden.lastInsertRowid as unknown as number;
            // Confirmar la transacción
            await transaction.commit();

            return NextResponse.json(
                { message: 'Orden creada exitosamente', id: Number(ordenId) },
                { status: 201 }
            );
        } catch (error) {
            // Revertir la transacción en caso de error
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Error al crear la orden:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}