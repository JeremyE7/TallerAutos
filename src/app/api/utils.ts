import { createApiResponse } from '@/lib/api'
import { v2 as cloudinary } from 'cloudinary'
import { createDecipheriv, createHash } from 'crypto'
import { NextResponse } from 'next/server'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
})

export const uploadImage = async (id: number, name: string, base64Image: string) => {
  try {
    return await cloudinary.uploader.upload(base64Image, {
      folder: 'FotosVehiculos',
      public_id: id.toString() + '-' + name, // Convertimos el ID a string
      resource_type: 'image',  // Cambiamos a un tipo de recurso válido
      overwrite: true,
      quality: 'auto', // Ajusta la calidad automáticamente
      fetch_format: 'auto', // Aplica compresión óptima
      width: 1200, // Redimensiona a un máximo de 1200px de ancho
      height: 1200, // Redimensiona a un máximo de 1200px de alto
      crop: 'limit', // Asegura que la imagen no se deforme
      format: 'webp'
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Error uploading image: ' + name)
  }
}

export const deleteImage = async (id: number, name: string) => {
  try {
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


export function decryptText (encryptedText: string, password: string): string {
  const [ivHex, encrypted] = encryptedText.split(':') // Extraemos el IV y el texto encriptado
  const iv = Buffer.from(ivHex, 'hex') // Convertimos el IV de vuelta a buffer
  const key = createHash('sha256').update(password).digest() // Generamos la clave de 32 bytes

  const decipher = createDecipheriv('aes-256-cbc', key, iv) // Crea el descifrador AES
  let decrypted = decipher.update(encrypted, 'hex', 'utf8') // Desencriptamos el texto
  decrypted += decipher.final('utf8') // Finaliza el descifrado

  return decrypted
}
export function validateHeader (
  request: Request,
  headerName: string[]
): NextResponse | null {
  const method = request.method.toUpperCase()

  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    const clientKey = request.headers.get(headerName[0])
    if (!clientKey) {
      return NextResponse.json(createApiResponse('Clave del cliente faltante o incorrecta.', 404))
    }
    const decryptedKey = decryptText(clientKey, process.env.SERVER_SECRET ?? 'keyPorDefectoXD')
    if(!(decryptedKey === process.env.SERVER_KEY)) {
      return NextResponse.json(createApiResponse('Clave del cliente faltante o incorrecta.', 404))
    }
  }
  return null // todo bien
}


// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const withHeaderValidation = (handler: Function) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (req: Request, context: any) => {
    const headerError = validateHeader(req, ['client-key'])
    if (headerError) return headerError

    return handler(req, context)
  }
}

