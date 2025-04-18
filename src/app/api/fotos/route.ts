import { fotosSchema } from '@/utils/fotos'
import { uploadImage, withHeaderValidation } from '../utils'
import { NextResponse } from 'next/server'
import { createApiResponse } from '@/lib/api'
import { db } from '@/db'
import { Fotos } from '@/db/schema'

// app/api/fotos/route.ts
export const POST = withHeaderValidation(async (req: Request) => {
  try {
    const body = await req.json()
    console.log('Body:', body)

    const validatedBody = fotosSchema.safeParse(body)
    if (!validatedBody.success) {
      return NextResponse.json(
        createApiResponse(validatedBody.error.errors.at(-1)?.message ?? '', 400)
      )
    }

    // Subir imágenes a tu servicio (Cloudinary, S3, etc.)
    const promisesUploadImages = Object.entries(validatedBody.data).map(async ([key, value]) => {
      if (value) {
        const uploadResponse = await uploadImage(0, key, value) // Usamos 'temp' como ID temporal
        if (!uploadResponse) return null
        return { [key]: uploadResponse.secure_url }
      }
      return null
    })

    const uploadedImages = await Promise.all(promisesUploadImages)
    const filteredImages = uploadedImages.filter((image) => image !== null)

    if (filteredImages.length === 0) {
      return NextResponse.json(
        createApiResponse('No hay imágenes válidas para subir', 400)
      )
    }

    const fotosToCreate = Object.assign({}, ...filteredImages)
    const newFotos = await db.insert(Fotos).values(fotosToCreate).returning().get()

    return NextResponse.json(
      createApiResponse('Fotos creadas', 201, newFotos)
    )

  } catch (error) {
    console.error('Error creating photos:', error)
    return NextResponse.json(
      createApiResponse('Error creating photos', 500)
    )
  }
})
