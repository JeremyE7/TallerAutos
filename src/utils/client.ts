import { z } from 'zod'
import { encryptText, isValidCI } from './general'
import { Cliente, Response } from '@/app/types'
import { settingsStore } from '@/store/settingsStore'

const {setError} = settingsStore.getState()

export const clientSchema = z.object({
  nombre: z.string({
    required_error: 'El nombre es obligatorio.',
    invalid_type_error: 'El nombre debe ser un texto.'
  }),
  cedula: z.string({
    required_error: 'La cédula es obligatoria.',
    invalid_type_error: 'La cédula debe ser un texto.'
  }).min(10, {
    message: 'La cédula debe tener al menos 10 caracteres.'
  }).refine(isValidCI, {
    message: 'La cédula ingresada no es válida.'
  }),
  email: z.string({
    invalid_type_error: 'El email debe ser un texto.'
  }).email({
    message: 'El email ingresado no es válido.'
  }).optional(),
  telefono: z.string({
    invalid_type_error: 'El teléfono debe ser un texto.'
  }).min(10, {
    message: 'El teléfono debe tener al menos 10 caracteres.'
  }).optional(),
  direccion: z.string({
    invalid_type_error: 'La dirección debe ser un texto.'
  }).optional()
})

export const clientUpdateSchema= clientSchema.partial().strict()

export const getClients = async () => {
  try{
    const response = await fetch('api/client')
    const data: Response<Cliente[]> = await response.json()
    if(data.code !== 200){
      console.error('Error fetching clients:', data.message)
      setError(data.message)
      return []
    }
    console.info(data.message)
    return data.data
  } catch(error){
    setError('Error interno del servidor. Por favor intente de nuevo más tarde.')
    console.error('Error fetching clients:', error)
  }
}


export const editClient = async (id: number, client: Omit<Cliente,'id'>, clientKey: string) => {
  try{
    const response = await fetch(`api/client/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'client-key': encryptText(clientKey, 'vinicarJOSEJEREMYXD')
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
