import { MetodoPago, OrdenTrabajo, Response, EstadosOrden } from '@/app/types'
import { settingsStore } from '@/store/settingsStore'
import { encryptText } from './general'
import { z } from 'zod'
import { vehicleSchema } from './vehicle'
import { elementosIngresoSchema } from './ElementosIngreso'
import { fotosSchema } from './fotos'

const { setError, setSuccess } = settingsStore.getState()
export const orderSchema = z.object({
  id: z.number().optional(),
  fechaIngreso: z.string({
    required_error: 'La fecha de ingreso es obligatoria.',
    invalid_type_error: 'La fecha de ingreso debe ser un texto.'
  }).datetime({ message: 'La fecha de ingreso debe ser una fecha y hora válida.' }),
  fechaSalida: z.string({
    required_error: 'La fecha de salida es obligatoria.',
    invalid_type_error: 'La fecha de salida debe ser un texto.'
  }).datetime({ message: 'La fecha de salida debe ser una fecha y hora válida.' }),
  operaciones_solicitadas: z.string({
    invalid_type_error: 'Las operaciones solicitadas deben ser un texto.'
  }).optional(),
  total_mo: z.number({
    invalid_type_error: 'El total de mano de obra debe ser un número.'
  }).nonnegative({ message: 'El total de mano de obra no puede ser negativo.' }).optional(),
  total_rep: z.number({
    invalid_type_error: 'El total de repuestos debe ser un número.'
  }).nonnegative({ message: 'El total de repuestos no puede ser negativo.' }).optional(),
  iva: z.number({
    invalid_type_error: 'El IVA debe ser un número.'
  }).nonnegative({ message: 'El IVA no puede ser negativo.' }).optional(),
  total: z.number({
    invalid_type_error: 'El total debe ser un número.'
  }).nonnegative({ message: 'El total no puede ser negativo.' }).optional(),
  comentarios: z.string({
    invalid_type_error: 'Los comentarios deben ser un texto.'
  }).optional(),
  forma_pago: z.nativeEnum(MetodoPago, {
    required_error: 'La forma de pago es obligatoria.',
    invalid_type_error: 'La forma de pago seleccionada no es válida.'
  }),
  estado: z.nativeEnum(EstadosOrden, {
    required_error: 'El estado de la orden es obligatorio.',
    invalid_type_error: 'El estado de la orden no es válido.'
  }).default(EstadosOrden.PENDIENTE)
})

export const createOrderSchema = orderSchema.extend({
  vehiculo: vehicleSchema.extend({
    id: z.number().optional()
  }),
  elementosIngreso: elementosIngresoSchema.extend({
    id: z.number().optional()
  }),
  foto: fotosSchema.extend({
    id: z.number().optional()
  }).optional()
}).strict()


export const createOrder = async (orderData: OrdenTrabajo, clientKey: string) => {
  try {
    const response = await fetch('/api/orden', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client-key': encryptText(clientKey, 'vinicarJOSEJEREMYXD')
      },
      body: JSON.stringify(orderData)
    })
    const data: Response<OrdenTrabajo> = await response.json()

    if (data.code !== 200) {
      console.error('Error creating order:', data)
      setError(data.message)
      return
    }

    console.info(data.message)
    setSuccess(data.message)
    return  data.data
  } catch (error) {
    console.error('Error creating order:', error)
    setError('Error interno del servidor. Intente más tarde.')
  }
}
/*
export const saveOrder = async (order: OrdenTrabajo, clientKey: string) => {
  const orderToSave = transformOrderForBackend(order)
  console.log('order to save:', orderToSave)
  try {
    const response = await fetch('api/orden', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client-key': encryptText(clientKey, 'vinicarJOSEJEREMYXD')
      },
      body: JSON.stringify(orderToSave)
    })

    const data: Response<OrdenTrabajo> = await response.json()
    if (data.code !== 200) {
      console.error('Error saving order:', data)
      setError(data.message)
      return
    }

    console.info(data.message)
    setSuccess(data.message)
    console.log('data de orden', data.data)

    return data.data

  } catch (error) {
    setError('Error interno del servidor. Por favor intente de nuevo más tarde.')
    console.error('Error saving order:', error)
  }
}*/

export const calcTotal = (order: OrdenTrabajo) => {
  //TOTAL = (Total M/O + Total REP) × (IVA)
  if (order) {
    const totalMo = parseFloat(order.total_mo?.toString() ?? '0')
    const totalRep = parseFloat(order.total_rep?.toString() ?? '0')
    const iva = parseFloat(order.iva?.toString() ?? '0')

    const total = (totalMo + totalRep) * iva
    return total
  }
}

export const getOrders = async () => {
  try {
    const response = await fetch('api/orden')
    const data: Response<OrdenTrabajo[]> = await response.json()
    if (data.code !== 200) {
      console.error('Error fetching orders:', data.message)
      setError(data.message)
      return []
    }

    console.info(data.message)
    return data.data

  } catch (error) {
    setError('Error interno del servidor. Por favor intente de nuevo más tarde.')
    console.error('Error fetching orders:', error)
  }
}

export const editOrder = async (id: number, order: OrdenTrabajo, clientKey: string) => {
  try {
    const response = await fetch(`api/orden/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'client-key': encryptText(clientKey, 'vinicarJOSEJEREMYXD')
      },
      body: JSON.stringify(order)
    })

    const data: Response<OrdenTrabajo> = await response.json()
    if (data.code !== 200) {
      setError(data.message)
      console.error('Error updating order:', data.message)
      return
    }

    console.info(data.message)
    return data.data

  } catch (error) {
    setError('Error interno del servidor. Por favor intente de nuevo más tarde.')
    console.error('Error updating order:', error)
  }
}

export const deleteOrder = async (id: number, clientKey: string) => {
  try {
    const response = await fetch(`api/orden/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'client-key': encryptText(clientKey, 'vinicarJOSEJEREMYXD')
      }
    })

    const data: Response<OrdenTrabajo> = await response.json()
    if (data.code !== 200) {
      setError(data.message)
      console.error('Error deleting order:', data.message)
      return
    }

    console.info(data.message)
    return data.data

  } catch (error) {
    console.error('Error deleting order:', error)
    setError('Error interno del servidor. Por favor intente de nuevo más tarde.')
  }

}

export const printOrder = async (id: number, clientKey: string) => {
  try {
    const response = await fetch(`api/orden/document/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
        'client-key': encryptText(clientKey, 'vinicarJOSEJEREMYXD')
      }
    })

    if (!response.ok) {
      setError('Ocurrio un error al generar el PDF, por favor intente de nuevo más tarde.')
      throw new Error('Error generating PDF')
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Orden_Trabajo-${id}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } catch (error) {
    setError('Ocurrio un error al generar el PDF, por favor intente de nuevo más tarde.')
    console.error('Error generating PDF:', error)
  }
}
export const deleteOrderFoto = async (id: number, attributeToDelete: string, clientKey: string) => {
  try {
    const response = await fetch(`api/orden/${id}/fotos`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'client-key': encryptText(clientKey, 'vinicarJOSEJEREMYXD')
      },
      body: JSON.stringify({ attributeToDelete })
    })

    const data: Response<OrdenTrabajo> = await response.json()
    if (data.code !== 200) {
      console.error('Error deleting order foto:', data.message)
      setError(data.message)
      return
    }

    console.info(data.message)
    return data.data

  } catch (error) {
    setError('Error interno del servidor. Por favor intente de nuevo más tarde.')
    console.error('Error deleting order foto:', error)
  }
}
