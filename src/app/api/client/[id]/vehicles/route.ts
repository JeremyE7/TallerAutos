import { Vehiculo } from '@/db/schema'
import { getByField } from '@/utils/crud'

export const GET = async (req: Request, { params }) => {
  const { id } = await params
  return getByField(
    Vehiculo,
    Vehiculo.cliente_id,
    parseInt(id),
    'No vehicle found',
    'Vehicle found',
    'Internal server error. Please try again later.'
  )
}
