import { uploadImage } from '@/app/api/utils'
import { createApiResponse } from '@/lib/api'
import { fotosUpdateSchema } from '@/utils/fotos'
import { NextResponse } from 'next/server'

export const PUT = async (req: Request, {params}) => {
  try{
    const body = await req.json()
    const { id } = await params

    const validatedBody = fotosUpdateSchema.safeParse(body)
    if(!validatedBody.success){
      return NextResponse.json(
        createApiResponse(JSON.parse(validatedBody.error.errors.at(-1)?.message ?? ''), 400)
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
    console.log('filteredImages:', filteredImages)





  }catch(error){
    console.error('Error updating order:', error)
    return NextResponse.json(
      createApiResponse('Error updating order', 500)
    )
  }
}
