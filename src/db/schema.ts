import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core'

export const Cliente = sqliteTable('Cliente', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  cedula: text('cedula').notNull().unique(),
  direccion: text('direccion'),
  email: text('email'),
  telefono: text('telefono')
})

export const Vehiculo = sqliteTable('Vehiculo', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  marca: text('marca').notNull(),
  modelo: text('modelo'),
  anio: integer('anio'),
  chasis: text('chasis'),
  motor: text('motor'),
  color: text('color'),
  placa: text('placa').notNull().unique(),
  kilometraje: integer('kilometraje'),
  cliente_id: integer('cliente_id').notNull().references(() => Cliente.id)
})

export const ElementosIngreso = sqliteTable('ElementosIngreso', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  limpiaparabrisas: integer('limpiaparabrisas', { mode: 'boolean' }),
  espejos: integer('espejos', { mode: 'boolean' }),
  luces: integer('luces', { mode: 'boolean' }),
  placas: integer('placas', { mode: 'boolean' }),
  emblemas: integer('emblemas', { mode: 'boolean' }),
  radio: integer('radio', { mode: 'boolean' }),
  control_alarma: integer('control_alarma', { mode: 'boolean' }),
  tapetes: integer('tapetes', { mode: 'boolean' }),
  aire_acondicionado: integer('aire_acondicionado', { mode: 'boolean' }),
  matricula: integer('matricula', { mode: 'boolean' }),
  herramientas: integer('herramientas', { mode: 'boolean' }),
  tuerca_seguridad: integer('tuerca_seguridad', { mode: 'boolean' }),
  gata: integer('gata', { mode: 'boolean' }),
  llave_ruedas: integer('llave_ruedas', { mode: 'boolean' }),
  extintor: integer('extintor', { mode: 'boolean' }),
  encendedor: integer('encendedor', { mode: 'boolean' }),
  antena: integer('antena', { mode: 'boolean' }),
  llanta_emergencia: integer('llanta_emergencia', { mode: 'boolean' }),
  combustible: integer('combustible').default(0)
})

export const Fotos = sqliteTable('Fotos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  frontal: text('frontal'),
  trasera: text('trasera'),
  derecha: text('derecha'),
  izquierda: text('izquierda'),
  superior: text('superior'),
  interior: text('interior')
})

export const OrdenTrabajo = sqliteTable('OrdenTrabajo', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fechaIngreso: text('fechaIngreso').notNull(),
  fechaSalida: text('fechaSalida').notNull(),
  operaciones_solicitadas: text('operaciones_solicitadas'),
  total_mo: real('total_mo'),
  total_rep: real('total_rep'),
  iva: real('iva'),
  total: real('total'),
  comentarios: text('comentarios'),
  vehiculo_id: integer('vehiculo_id').notNull().references(() => Vehiculo.id),
  elementos_ingreso_id: integer('elementos_ingreso_id').notNull().references(() => ElementosIngreso.id),
  fotos_id: integer('fotos_id').notNull().references(() => Fotos.id),
  forma_pago: text('forma_pago').notNull(),
  estado: text('estado').notNull().default('Pendiente')
})
