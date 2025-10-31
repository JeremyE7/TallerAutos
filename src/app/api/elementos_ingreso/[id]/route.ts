import { ElementosIngreso } from '@/db/schema'
import { getById, updateById, deleteById } from '@/utils/crud'
import { withHeaderValidation } from '../../utils'


// obtener una orden por su id de param
export const GET = async (req: Request, { params }) => {
  const { id } = await params
  return getById(
    ElementosIngreso,
    parseInt(id),
    'No se encontro los elementos de ingreso',
    'Elementos de Ingreso encontrado',
    'Elementos de Ingreso no encontrado'
  )
}

// Actualizar una orden por su id de param
export const PUT = withHeaderValidation(async (req: Request, { params }) => {
  const { id } = await params
  const body = await req.json()

  return updateById(
    ElementosIngreso,
    parseInt(id),
    body,
    undefined,
    'Elementos de Ingreso actualizados',
    'Elementos de Ingreso no encontrados'
  )
})

// Eliminar una orden por su id de param
export const DELETE = withHeaderValidation(async (req: Request, { params }) => {
  const { id } = await params
  return deleteById(
    ElementosIngreso,
    parseInt(id),
    'Elementos de Ingreso',
    'Orden no encontrada'
  )
})
