// Enumerado para los métodos de pago
export enum MetodoPago {
  EFECTIVO = 'Efectivo',
  TARJETA_CREDITO = 'Tarjeta de crédito',
}

// Tipo para Cliente
export interface Cliente {
  nombre: string
  cedula: string
  direccion?: string
  email?: string
  telefono?: string
}

// Tipo para Vehículo (relacionado a Cliente)
export interface Vehiculo {
  marca: string
  modelo?: string
  anio?: number
  chasis?: string
  motor?: string
  color?: string
  placa: string
  kilometraje?: number
  combustible?: number
  cliente: Cliente // Relación: cada vehículo pertenece a un cliente
}

// Tipo para Elementos Revisados (relacionado con OrdenTrabajo)
export interface ElementosIngreso {
  limpiaparabrisas?: boolean
  espejos?: boolean
  luces?: boolean
  placas?: boolean
  emblemas?: boolean
  radio?: boolean
  control_alarma?: boolean
  tapetes?: boolean
  aire_acondicionado?: boolean
  matricula?: boolean
  herramientas?: boolean
  tuerca_seguridad?: boolean
  gata?: boolean
  llave_ruedas?: boolean
  extintor?: boolean
  encendedor?: boolean
  antena?: boolean
  llanta_emergencia?: boolean
}

// Tipo para Orden de Trabajo (relacionado a Vehículo, que a su vez está vinculado a Cliente)
export interface OrdenTrabajo {
  fechaIngreso: Date
  fechaSalida: Date
  operaciones_solicitadas?: string
  total_mo?: number
  total_rep?: number
  iva?: number
  total?: number
  comentarios?: string
  vehiculo: Vehiculo // Relación: cada orden se asocia a un vehículo
  elementos_ingreso: ElementosIngreso // Relación: la orden contiene los elementos revisados
  forma_pago: MetodoPago // Relación: la orden define un método de pago
}
