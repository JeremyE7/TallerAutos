import { EstadosOrden, MetodoPago, OrdenTrabajo, Response } from '@/app/types'

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

export const getOrders = () => {
  try {
    const storedOrders = localStorage.getItem('orders')
    if (storedOrders) {
      const data: Response<OrdenTrabajo[]> = JSON.parse(storedOrders)
      if (data.code !== 200) {
        console.error('Error fetching orders:', data.message)
        return []
      }

      console.info(data.message)

      // Convertir fechas y enums
      return data.data?.map(order => ({
        ...order,
        fechaIngreso: new Date(order.fechaIngreso),
        fechaSalida: new Date(order.fechaSalida),
        forma_pago: order.forma_pago as MetodoPago,
        estado: order.estado as EstadosOrden
      }))
    }

    // Si no hay datos en el localStorage, se crea y se guarda el objeto por defecto
    console.info('No orders found in local storage, creating default data...')
    const defaultData: Response<OrdenTrabajo[]> = {
      message: 'Datos cargados correctamente',
      code: 200,
      data: [
        {
          id: 1,
          fechaIngreso: new Date('2025-03-20T00:00:00.000Z'),
          fechaSalida: new Date('2025-03-21T00:00:00.000Z'),
          operaciones_solicitadas: 'Cambio de aceite, revisión de frenos',
          total_mo: 50,
          total_rep: 30,
          iva: 10,
          total: 90,
          comentarios: 'Todo en orden',
          vehiculo: {
            id: 1,
            marca: 'Toyota',
            modelo: 'Corolla',
            anio: 2020,
            placa: 'ABC123',
            cliente: {
              id: 1,
              nombre: 'Juan Pérez',
              cedula: '123456789',
              direccion: 'Calle Ficticia 123',
              email: 'juanperez@mail.com',
              telefono: '0987654321'
            }
          },
          elementosIngreso: {
            id: 1,
            limpiaparabrisas: true,
            espejos: true,
            luces: true,
            placas: true,
            emblemas: false,
            radio: true,
            control_alarma: false,
            tapetes: true,
            aire_acondicionado: true,
            matricula: true,
            herramientas: false,
            tuerca_seguridad: true,
            gata: false,
            llave_ruedas: true,
            extintor: true,
            encendedor: true,
            antena: true,
            llanta_emergencia: false,
            combustible: 50
          },
          forma_pago: MetodoPago.EFECTIVO,
          estado: EstadosOrden.PENDIENTE
        }
      ]
    }

    // Guardar los datos por defecto en el localStorage
    localStorage.setItem('orders', JSON.stringify(defaultData))

    return defaultData.data
  } catch (error) {
    console.error('Error getting orders from local storage:', error)
    return []
  }
}


export const editOrder = (id: number, order: OrdenTrabajo) => {
  try {
    const storedOrders = localStorage.getItem('orders')
    if (storedOrders) {
      const data: Response<OrdenTrabajo[]> = JSON.parse(storedOrders)
      if (data.code !== 200) {
        console.error('Error fetching orders:', data.message)
        return
      }

      const updatedOrders = data.data?.map((existingOrder) =>
        existingOrder.id === id ? { ...existingOrder, ...order } : existingOrder
      )

      localStorage.setItem('orders', JSON.stringify({ ...data, data: updatedOrders }))
      console.info('Order updated successfully')
      return updatedOrders
    } else {
      console.error('No orders found in local storage')
    }
  } catch (error) {
    console.error('Error editing order in local storage:', error)
  }
}

export const deleteOrder = (id: number) => {
  try {
    const storedOrders = localStorage.getItem('orders')
    if (storedOrders) {
      const data: Response<OrdenTrabajo[]> = JSON.parse(storedOrders)
      if (data.code !== 200) {
        console.error('Error fetching orders:', data.message)
        return
      }

      const updatedOrders = data.data?.filter((order) => order.id !== id)

      localStorage.setItem('orders', JSON.stringify({ ...data, data: updatedOrders }))
      console.info('Order deleted successfully')
      return updatedOrders
    } else {
      console.error('No orders found in local storage')
    }
  } catch (error) {
    console.error('Error deleting order in local storage:', error)
  }
}

