import { OrdenTrabajo, Response } from '@/app/types'
import { settingsStore } from '@/store/settingsStore'
import { encryptText } from './general'

const { setError, setSuccess } = settingsStore.getState()
export const transformOrderForBackend = (frontendOrder: OrdenTrabajo) => {
  return {
    cliente: {
      ...frontendOrder.vehiculo.cliente
    },
    vehiculo: {
      ...frontendOrder.vehiculo,
      cliente: undefined // Eliminamos el cliente anidado
    },
    elementosIngreso: frontendOrder.elementosIngreso,
    fechaIngreso: frontendOrder.fechaIngreso,
    fechaSalida: frontendOrder.fechaSalida,
    operaciones_solicitadas: frontendOrder.operaciones_solicitadas,
    total_mo: frontendOrder.total_mo,
    total_rep: frontendOrder.total_rep,
    iva: frontendOrder.iva,
    total: frontendOrder.total,
    comentarios: frontendOrder.comentarios,
    forma_pago: frontendOrder.forma_pago,
    estado: frontendOrder.estado,
    fotos: {
      frontal: frontendOrder.foto?.frontal ?? '',
      trasera: frontendOrder.foto?.trasera ?? '',
      derecha: frontendOrder.foto?.derecha ?? '',
      izquierda: frontendOrder.foto?.izquierda ?? '',
      superior: frontendOrder.foto?.superior ?? '',
      interior: frontendOrder.foto?.interior ?? ''
    }
  }
}
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
    return data.data

  } catch (error) {
    setError('Error interno del servidor. Por favor intente de nuevo más tarde.')
    console.error('Error saving order:', error)
  }
}

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
