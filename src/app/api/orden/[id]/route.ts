import { OrdenTrabajo } from '@/db/schema'
import { getById, updateById, deleteById } from '@/utils/crud'
import { withHeaderValidation } from '../../utils'

// obtener una orden por su id de param
export const GET = async (req: Request, { params }) => {
  const { id } = await params
  return getById(
    OrdenTrabajo,
    parseInt(id),
    'No order found',
    'Orden encontrada',
    'Orden no encontrada'
  )
}

// Actualizar una orden por su id de param
export const PUT = withHeaderValidation(async (req: Request, { params }) => {
  const { id } = await params
  const body = await req.json()

  return updateById(
    OrdenTrabajo,
    parseInt(id),
    body,
    undefined,
    'Orden actualizada',
    'Orden no encontrada'
  )
})

// Eliminar una orden por su id de param
export const DELETE = withHeaderValidation(async (req: Request, { params }) => {
  const { id } = await params
  return deleteById(
    OrdenTrabajo,
    parseInt(id),
    'Orden',
    'Orden no encontrada'
  )
})
