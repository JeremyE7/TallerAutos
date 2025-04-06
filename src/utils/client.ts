import { z } from 'zod'
import { encryptText, isValidCI } from './general'
import { Cliente, Response } from '@/app/types'
import { settingsStore } from '@/store/settingsStore'

const {setError} = settingsStore.getState()

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

export const getClients = async () => {
  try{
    const response = await fetch('api/client')
    const data: Response<Cliente[]> = await response.json()
    if(data.code !== 200){
      console.error('Error fetching clients:', data.message)
      return []
    }
    console.info(data.message)
    return data.data
  } catch(error){
    console.error('Error fetching clients:', error)
  }
}


export const editClient = async (id: number, client: Omit<Cliente,'id'>, clientKey: string) => {
  try{
    console.log(encryptText(clientKey, 'vinicarJOSEJEREMYXD'));
    
    const response = await fetch(`api/client/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'client-key': encryptText(clientKey, 'vinicarJOSEJEREMYXD'),
      },
      body: JSON.stringify(client)
    })
    const data: Response<Cliente> = await response.json()
    if(data.code !== 200){
      console.error('Error editing client:', data.message)
      setError(data.message)
      return
    }
    console.info(data.message)
    return data.data
  } catch(error){
    setError('Error interno del servidor. Por favor intente de nuevo más tarde.')
    console.error('Error editing client:', error)
  }
}
