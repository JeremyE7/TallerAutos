import { OrdenTrabajo } from '@/db/schema'
import { getByField } from '@/utils/crud'

export const GET = async (req: Request, { params }) => {
  const { id } = await params
  return getByField(
    OrdenTrabajo,
    OrdenTrabajo.vehiculo_id,
    parseInt(id),
    'No se encontraron ordenes',
    'Orders found',
    'Internal server error. Please try again later.'
  )
}
