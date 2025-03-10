import { z } from 'zod'
import { isValidCI } from './general'

export const clientSchema = z.object({
  nombre: z.string(),
  cedula: z.string().min(10).refine(isValidCI, {
    message: 'La cédula ingresada no es válida.'
  }),
  email: z.string().email().optional(),
  telefono: z.string().min(10).optional(),
  direccion: z.string().optional()
})

export const clientUpdateSchema= clientSchema.partial().strict()
