import {v2 as cloudinary} from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
})

export const uploadImage = async (id: number,name: string, base64Image: string) => {
  try{

    return await cloudinary.uploader.upload(base64Image, {
      folder: 'FotosVehiculos',
      public_id: id.toString() + '-' + name, // Convertimos el ID a string
      resource_type: 'image'  // Cambiamos a un tipo de recurso válido
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Error uploading image: ' + name)
    return null
  }
}
