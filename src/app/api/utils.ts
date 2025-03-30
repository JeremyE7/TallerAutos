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
      resource_type: 'image',  // Cambiamos a un tipo de recurso válido
      overwrite: true,
      quality: "auto", // Ajusta la calidad automáticamente
      fetch_format: "auto", // Aplica compresión óptima
      width: 1200, // Redimensiona a un máximo de 1200px de ancho
      height: 1200, // Redimensiona a un máximo de 1200px de alto
      crop: "limit", // Asegura que la imagen no se deforme
      format: "webp" 
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Error uploading image: ' + name)
  }
}

export const deleteImage = async (id: number, name: string) => {
  try{
    const publicId = id.toString() + '-' + name
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image'
    })
    return response
  } catch (error) {
    console.error('Error deleting image:', error)
    throw new Error('Error deleting image: ' + name)
  }
}
