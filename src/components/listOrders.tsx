import { OrdenTrabajo } from '@/app/types'
import { ListItemOrder } from './lisItemOrder'

interface ListOrdersProps {
    items: OrdenTrabajo[]
}
export const ListOrders = ({items} : ListOrdersProps) => {

  if (!items || items.length === 0) return null

  const list = items.map((order) => {
    return ListItemOrder({order: order})
  })

  return <>{list}</>
}
