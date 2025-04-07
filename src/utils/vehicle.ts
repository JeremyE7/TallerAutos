import { Response, Vehiculo } from '@/app/types'
import { settingsStore } from '@/store/settingsStore'
import {z} from 'zod'
import { encryptText } from './general'


const {setError} = settingsStore.getState()


export const vehicleSchema = z.object({
  marca: z.string(),
  modelo: z.string().optional(),
  anio: z.number().int().min(1800).max((new Date()).getFullYear()).optional(),
  chasis: z.string().optional(),
  motor: z.string().optional(),
  color: z.string().optional(),
  placa: z.string().min(6),
  kilometraje: z.number().int().optional(),
  combustible: z.number().int().optional(),
  cliente_id: z.number().int()
})

export const vehicleUpdateSchema = vehicleSchema.partial().strict()

export const getVehicles = async () => {
  try{
    const response = await fetch('api/vehiculo')
    const data: Response<Vehiculo[]> = await response.json()
    if(data.code !== 200){
      console.error('Error fetching vehicles:', data.message)
      setError(data.message)
      return []
    }
    console.info(data.message)
    return data.data
  } catch(error){
    setError('Error interno del servidor. Por favor intente de nuevo más tarde.')
    console.error('Error fetching vehicles:', error)
  }
}

export const editVehicle = async (id: number, vehicle: Omit<Vehiculo,'id'| 'cliente'>, clientKey: string) => {
  try{
    const response = await fetch(`api/vehiculo/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'client-key': encryptText(clientKey, 'vinicarJOSEJEREMYXD')
      },
      body: JSON.stringify(vehicle)
    })
    const data: Response<Vehiculo> = await response.json()
    if(data.code !== 200){
      console.error('Error editing vehicle:', data.message)
      setError(data.message)
      return
    }
    console.info(data.message)
    return data.data
  } catch(error){
    console.error('Error editing vehicle:', error)
    setError('Error interno del servidor. Por favor intente de nuevo más tarde.')
  }

}
