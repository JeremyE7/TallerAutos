import { Vehiculo } from '@/db/schema'
import { vehicleUpdateSchema } from '@/utils/vehicle'
import { getById, updateById, deleteById } from '@/utils/crud'
import { withHeaderValidation } from '../../utils'

export const GET = async (req: Request, { params }) => {
  const { id } = await params
  return getById(
    Vehiculo,
    parseInt(id),
    'No vehicle found',
    'Vehicle found',
    'Internal server error. Please try again later.'
  )
}

export const PUT = withHeaderValidation(async (req: Request, { params }) => {
  const { id } = await params
  const body = await req.json()

  return updateById(
    Vehiculo,
    parseInt(id),
    body,
    vehicleUpdateSchema,
    'Vehicle updated',
    'Internal server error. Please try again later.'
  )
})

export const DELETE = withHeaderValidation(async (req: Request, { params }) => {
  const { id } = await params
  return deleteById(
    Vehiculo,
    parseInt(id),
    'Vehicle',
    'Internal server error. Please try again later.'
  )
})
