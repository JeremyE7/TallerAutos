import { Foto, Response } from '@/app/types'
import { z } from 'zod'

export const fotosSchema = z.object({
  frontal: z.string().optional(),
  trasera: z.string().optional(),
  derecha: z.string().optional(),
  izquierda: z.string().optional(),
  superior: z.string().optional(),
  interior: z.string().optional()
})

export const fotosUpdateSchema= fotosSchema.partial().strict()

export const editFotos = async (id: number, fotos: Omit<Foto, 'id'>) => {

  try{
    const response = await fetch(`api/orden/${id}/fotos`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fotos)
    })

    const data: Response<Foto> = await response.json()
    if(data.code !== 200){
      console.error('Error updating order:', data.message)
      return
    }

    console.info(data.message)
    return data.data

  }catch(error){
    console.error('Error updating order:', error)
  }

}
