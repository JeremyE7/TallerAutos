import { OrdenTrabajo, Response } from '@/app/types'

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
      return []
    }

    console.info(data.message)
    return data.data

  } catch (error) {
    console.error('Error fetching orders:', error)
  }
}

export const editOrder = async (id: number, order: OrdenTrabajo) => {
  try {
    const response = await fetch(`api/orden/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    })

    const data: Response<OrdenTrabajo> = await response.json()
    if (data.code !== 200) {
      console.error('Error updating order:', data.message)
      return
    }

    console.info(data.message)
    return data.data

  } catch (error) {
    console.error('Error updating order:', error)
  }
}

export const deleteOrder = async (id: number) => {
  try {
    const response = await fetch(`api/orden/${id}`, {
      method: 'DELETE'
    })

    const data: Response<OrdenTrabajo> = await response.json()
    if (data.code !== 200) {
      console.error('Error deleting order:', data.message)
      return
    }

    console.info(data.message)
    return data.data

  } catch (error) {
    console.error('Error deleting order:', error)
  }

}

export const printOrder = async (id: number) => {
  try {
    const response = await fetch(`api/orden/document/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf'
      }
    })

    if (!response.ok) {
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
    console.error('Error generating PDF:', error)
  }
}
export const deleteOrderFoto = async (id: number, attributeToDelete: string) => {
  try {
    const response = await fetch(`api/orden/${id}/fotos`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ attributeToDelete })
    })

    const data: Response<OrdenTrabajo> = await response.json()
    if (data.code !== 200) {
      console.error('Error deleting order foto:', data.message)
      return
    }

    console.info(data.message)
    return data.data

  } catch (error) {
    console.error('Error deleting order foto:', error)
  }
}
