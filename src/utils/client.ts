import { z } from 'zod'
import { isValidCI } from './general'
import { Cliente, Response } from '@/app/types'

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
