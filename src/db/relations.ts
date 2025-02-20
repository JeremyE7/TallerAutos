import { relations } from 'drizzle-orm/relations'
import { Cliente, ElementosIngreso, Fotos, OrdenTrabajo, Vehiculo } from './schema'

export const vehiculoRelations = relations(Vehiculo, ({one, many}) => ({
  cliente: one(Cliente, {
    fields: [Vehiculo.cliente_id],
    references: [Cliente.id]
  }),
  ordenTrabajos: many(OrdenTrabajo)
}))

export const clienteRelations = relations(Cliente, ({many}) => ({
  vehiculos: many(Vehiculo)
}))

export const ordenTrabajoRelations = relations(OrdenTrabajo, ({one}) => ({
  foto: one(Fotos, {
    fields: [OrdenTrabajo.fotos_id],
    references: [Fotos.id]
  }),
  elementosIngreso: one(ElementosIngreso, {
    fields: [OrdenTrabajo.elementos_ingreso_id],
    references: [ElementosIngreso.id]
  }),
  vehiculo: one(Vehiculo, {
    fields: [OrdenTrabajo.vehiculo_id],
    references: [Vehiculo.id]
  })
}))

export const fotosRelations = relations(Fotos, ({many}) => ({
  ordenTrabajos: many(OrdenTrabajo)
}))

export const elementosIngresoRelations = relations(ElementosIngreso, ({many}) => ({
  ordenTrabajos: many(OrdenTrabajo)
}))
