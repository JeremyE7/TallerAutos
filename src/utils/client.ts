import { z } from 'zod'
import { isValidCI } from './general'
import { Cliente, Response } from '@/app/types'
// import { settingsStore } from '@/store/settingsStore'

// const {setError} = settingsStore.getState()

export const clientSchema = z.object({
  nombre: z.string(),
  cedula: z.string().min(10).refine(isValidCI, {
    message: 'La cédula ingresada no es válida.'
  }),
  email: z.string().email().optional(),
  telefono: z.string().min(10).optional(),
  direccion: z.string().optional()
})

export const clientUpdateSchema= clientSchema.partial().strict()

export const getClients = () => {
  try {
    const storedClients = localStorage.getItem('clients')
    if (storedClients) {
      // Si los clientes están en el localStorage, los parseamos y los retornamos
      const data: Response<Cliente[]> = JSON.parse(storedClients)
      if (data.code !== 200) {
        console.error('Error fetching clients:', data.message)
        return []
      }
      console.info(data.message)
      return data.data
    }

    // Si no hay clientes en el localStorage, se crea y se guarda el objeto por defecto
    console.info('No clients found in local storage, creating default data...')
    const defaultData = {
      'message': 'Datos cargados correctamente',
      'code': 200,
      'data': [
        {
          'id': 1,
          'nombre': 'Juan Pérez',
          'cedula': '123456789',
          'direccion': 'Calle Ficticia 123',
          'email': 'juanperez@mail.com',
          'telefono': '0987654321'
        },
        {
          'id': 2,
          'nombre': 'Ana Gómez',
          'cedula': '987654321',
          'direccion': 'Avenida Central 456',
          'email': 'anagomez@mail.com',
          'telefono': '0998765432'
        }
      ]
    }

    // Guardar los datos por defecto en el localStorage
    localStorage.setItem('clients', JSON.stringify(defaultData))

    return defaultData.data
  } catch (error) {
    console.error('Error getting clients from local storage:', error)
    return []
  }
}


export const editClient = (id: number, client: Omit<Cliente, 'id'>) => {
  try {
    // Obtener los clientes almacenados
    const storedClients = localStorage.getItem('clients')
    if (storedClients) {
      const data: Response<Cliente[]> = JSON.parse(storedClients)
      if (data.code !== 200) {
        console.error('Error fetching clients:', data.message)
        return
      }

      // Editar el cliente dentro de la lista
      const updatedClients = data.data?.map((existingClient) =>
        existingClient.id === id ? { ...existingClient, ...client } : existingClient
      )

      // Guardar la lista de clientes actualizada en el localStorage
      localStorage.setItem('clients', JSON.stringify({ ...data, data: updatedClients }))
      console.info('Client edited successfully')
      return updatedClients
    } else {
      console.error('No clients found in local storage')
    }
  } catch (error) {
    console.error('Error editing client in local storage:', error)
  }
}
