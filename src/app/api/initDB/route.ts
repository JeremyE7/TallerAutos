import { NextResponse } from 'next/server';
import tursoClient from '@/lib/turso'; // Importa el cliente de Turso

export async function GET() {
  try {
    // Crear tabla Cliente
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS Cliente (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        cedula TEXT NOT NULL UNIQUE,
        direccion TEXT,
        email TEXT,
        telefono TEXT
      );
    `);

    // Crear tabla Vehiculo
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS Vehiculo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        marca TEXT NOT NULL,
        modelo TEXT,
        anio INTEGER,
        chasis TEXT,
        motor TEXT,
        color TEXT,
        placa TEXT NOT NULL UNIQUE,
        kilometraje INTEGER,
        combustible INTEGER,
        cliente_id INTEGER NOT NULL,
        FOREIGN KEY (cliente_id) REFERENCES Cliente(id)
      );
    `);

    // Crear tabla ElementosIngreso
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS ElementosIngreso (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        limpiaparabrisas BOOLEAN,
        espejos BOOLEAN,
        luces BOOLEAN,
        placas BOOLEAN,
        emblemas BOOLEAN,
        radio BOOLEAN,
        control_alarma BOOLEAN,
        tapetes BOOLEAN,
        aire_acondicionado BOOLEAN,
        matricula BOOLEAN,
        herramientas BOOLEAN,
        tuerca_seguridad BOOLEAN,
        gata BOOLEAN,
        llave_ruedas BOOLEAN,
        extintor BOOLEAN,
        encendedor BOOLEAN,
        antena BOOLEAN,
        llanta_emergencia BOOLEAN
      );
    `);
    // Crear tabla Fotos
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS Fotos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        frontal TEXT,
        trasera TEXT,
        derecha TEXT,
        izquierda TEXT,
        superior TEXT,
        interior TEXT
      );
    `);
    // Crear tabla OrdenTrabajo
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS OrdenTrabajo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fechaIngreso TEXT NOT NULL,
        fechaSalida TEXT NOT NULL,
        operaciones_solicitadas TEXT,
        total_mo REAL,
        total_rep REAL,
        iva REAL,
        total REAL,
        comentarios TEXT,
        vehiculo_id INTEGER NOT NULL,
        elementos_ingreso_id INTEGER NOT NULL,
        fotos_id INTEGER NOT NULL,
        forma_pago TEXT NOT NULL,
        FOREIGN KEY (vehiculo_id) REFERENCES Vehiculo(id),
        FOREIGN KEY (elementos_ingreso_id) REFERENCES ElementosIngreso(id)
        FOREIGN KEY (fotos_id) REFERENCES Fotos(id)
      );
    `);

    console.log('Tablas creadas correctamente.');
    return NextResponse.json({ message: 'Tablas creadas correctamente.' });
  } catch (error) {
    console.error('Error al crear las tablas:', error);
    return NextResponse.json(
      { error: 'Error al crear las tablas' },
      { status: 500 });
  }
}