import {z} from 'zod'

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
