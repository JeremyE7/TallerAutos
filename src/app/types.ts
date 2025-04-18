export interface Response<T> {
  message: string
  code: number
  data?: T
}

export interface Option {
  name: string;
  icon: string;
  code: string;
}

// Enumerado para los métodos de pago
export enum MetodoPago {
  EFECTIVO = 'Efectivo',
  TARJETA_CREDITO = 'Tarjeta de crédito',
  TRANSFERENCIA = 'Transferencia',
}

export enum EstadosOrden {
  PENDIENTE = 'Pendiente',
  EN_PROCESO = 'En proceso',
  FINALIZADA = 'Finalizada',
  CANCELADA = 'Cancelada',
}

// Tipo para Cliente
export interface Cliente {
  id: number,
  nombre: string
  cedula: string
  direccion?: string
  email?: string
  telefono?: string
}

// Tipo para Vehículo (relacionado a Cliente)
export interface Vehiculo {
  id: number,
  marca: string
  modelo?: string
  anio?: number
  chasis?: string
  motor?: string
  color?: string
  placa: string
  kilometraje?: number
  cliente: Cliente // Relación: cada vehículo pertenece a un cliente
}

// Tipo para Elementos Revisados (relacionado con OrdenTrabajo)
export interface ElementosIngreso {
  id: number,
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
  llanta_emergencia?: boolean,
  combustible?: number
}

// Tipo para Orden de Trabajo (relacionado a Vehículo, que a su vez está vinculado a Cliente)
export interface OrdenTrabajo {
  id: number,
  fechaIngreso: Date
  fechaSalida: Date
  operaciones_solicitadas?: string
  total_mo?: number
  total_rep?: number
  iva?: number
  total?: number
  comentarios?: string
  vehiculo: Vehiculo // Relación: cada orden se asocia a un vehículo
  elementosIngreso: ElementosIngreso // Relación: la orden contiene los elementos revisados
  forma_pago: MetodoPago // Relación: la orden define un método de pago
  foto?: Foto
  estado: EstadosOrden
}

export interface Foto {
  id: number;
  frontal?: string;
  trasera?: string;
  derecha?: string;
  izquierda?: string;
  superior?: string;
  interior?: string;
};

export interface ModalProps {
  cliente?: Cliente,
  vehiculo?: Vehiculo,
  elementosIngreso?: ElementosIngreso,
  fotos?: Foto,
}
