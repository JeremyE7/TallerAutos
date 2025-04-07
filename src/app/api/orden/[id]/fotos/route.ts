import { deleteImage, uploadImage } from '@/app/api/utils'
import { db } from '@/db'
import { Fotos } from '@/db/schema'
import { createApiResponse } from '@/lib/api'
import { fotosUpdateSchema } from '@/utils/fotos'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { withHeaderValidation } from '../../../utils'

export const PUT = withHeaderValidation(async (req: Request, {params}) => {
  try{
    const body = await req.json()
    const { id } = await params
    console.log('ID:', id, 'Body:', body)

    const validatedBody = fotosUpdateSchema.safeParse(body)

    if(!validatedBody.success){
      return NextResponse.json(
        createApiResponse(validatedBody.error.errors.at(-1)?.message ?? '', 400)
      )
    }

    const promisesUploadImages = Object.entries(validatedBody.data).map(async ([key, value]) => {
      if(value){
        const uploadResponse = await uploadImage(id, key, value)
        if(!uploadResponse) return null
        return { [key]: uploadResponse.secure_url }
      }
      return null
    })

    const uploadedImages = await Promise.all(promisesUploadImages)
    const filteredImages = uploadedImages.filter((image) => image !== null)

    if(filteredImages.length === 0){
      return NextResponse.json(
        createApiResponse('No hay imagenes para actualizar', 400)
      )
    }

    const fotosToUpdate = Object.assign({}, ...filteredImages)
    const updatedFotos = await db.update(Fotos).set(fotosToUpdate).where(eq(Fotos.id, parseInt(id))).returning().get()
    if(!updatedFotos){
      return NextResponse.json(
        createApiResponse('Error al actualizar las fotos', 404)
      )
    }

    return NextResponse.json(
      createApiResponse('Fotos actualizadas', 200, updatedFotos)
    )

  }catch(error){
    console.error('Error updating order:', error)
    return NextResponse.json(
      createApiResponse('Error updating order', 500)
    )
  }
})

export const DELETE = withHeaderValidation(async (req: Request, {params}) => {
  const { id } = await params
  const body = await req.json()

  if(!body.attributeToDelete){
    return NextResponse.json(
      createApiResponse('No se ha indicado que imagen eliminar', 400)
    )
  }
  const {attributeToDelete} = body
  console.log('ID:', id, 'Body:', body)

  const deletedImage = await deleteImage(id, attributeToDelete)

  if(!deletedImage){
    return NextResponse.json(
      createApiResponse('Error al eliminar la imagen', 404)
    )
  }

  const deletedFotos = await db.update(Fotos).set({[attributeToDelete]: null}).where(eq(Fotos.id, parseInt(id))).returning().get()

  if(!deletedFotos){
    return NextResponse.json(
      createApiResponse('Error al eliminar la imagen', 404)
    )
  }
  return NextResponse.json(
    createApiResponse('Imagen eliminada', 200, deletedFotos)
  )
})


