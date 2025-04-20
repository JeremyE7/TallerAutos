import { Response, Vehiculo } from '@/app/types'
import { settingsStore } from '@/store/settingsStore'
import { z } from 'zod'
import { encryptText } from './general'
import { clientSchema } from './client'


const { setError } = settingsStore.getState()


export const vehicleSchema = z.object({
  marca: z.string({
    required_error: 'La marca es obligatoria.',
    invalid_type_error: 'La marca debe ser un texto.'
  }),
  modelo: z.string({
    invalid_type_error: 'El modelo debe ser un texto.'
  }).optional(),
  anio: z.number({
    required_error: 'El año es obligatorio.',
    invalid_type_error: 'El año debe ser un número.'
  }).min(1886, 'El año debe ser mayor o igual a 1886.'),
  chasis: z.string({
    invalid_type_error: 'El chasis debe ser un texto.'
  }).optional(),
  motor: z.string({
    invalid_type_error: 'El motor debe ser un texto.'
  }).optional(),
  color: z.string({
    invalid_type_error: 'El color debe ser un texto.'
  }).optional(),
  placa: z.string({
    required_error: 'La placa es obligatoria.',
    invalid_type_error: 'La placa debe ser un texto.'
  }).min(6, 'La placa debe tener al menos 6 caracteres.'),
  kilometraje: z.number({
    invalid_type_error: 'El kilometraje debe ser un número.'
  }).int('El kilometraje debe ser un número entero.').optional(),
  cliente: clientSchema
})

export const vehicleUpdateSchema = vehicleSchema.partial().strict()

export const createVehicle = async (vehicle: Omit<Vehiculo, 'id' | 'cliente'>, clientKey: string) => {
  try {
    const response = await fetch('api/vehiculo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client-key': encryptText(clientKey, 'vinicarJOSEJEREMYXD')
      },
      body: JSON.stringify(vehicle)
    })
    const data: Response<Vehiculo> = await response.json()
    if (data.code !== 200) {
      console.error('Error creating vehicle:', data.message)
      setError(data.message)
      return
    }
    console.log('capaz este vejocas ;dlasm d', data)
    return data.data
  }
  catch (error) {
    console.error('Error creating vehicle:', error)
    setError('Error interno del servidor. Por favor intente de nuevo más tarde.')
  }
}

export const getVehicles = async () => {
  try {
    const response = await fetch('api/vehiculo')
    const data: Response<Vehiculo[]> = await response.json()
    if (data.code !== 200) {
      console.error('Error fetching vehicles:', data.message)
      setError(data.message)
      return []
    }
    console.info(data.message)
    return data.data
  } catch (error) {
    setError('Error interno del servidor. Por favor intente de nuevo más tarde.')
    console.error('Error fetching vehicles:', error)
  }
}

export const editVehicle = async (id: number, vehicle: Omit<Vehiculo, 'id' | 'cliente'>, clientKey: string) => {
  try {
    const response = await fetch(`api/vehiculo/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'client-key': encryptText(clientKey, 'vinicarJOSEJEREMYXD')
      },
      body: JSON.stringify(vehicle)
    })
    const data: Response<Vehiculo> = await response.json()
    if (data.code !== 200) {
      console.error('Error editing vehicle:', data.message)
      setError(data.message)
      return
    }
    console.info(data.message)
    return data.data
  } catch (error) {
    console.error('Error editing vehicle:', error)
    setError('Error interno del servidor. Por favor intente de nuevo más tarde.')
  }

}
