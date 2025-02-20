'use client'
import { OrdenTrabajo } from '@/app/types'

interface ListItemOrderProps {
    order: OrdenTrabajo
}

export const ListItemOrder = ({ order }: ListItemOrderProps) => {


  return (
    order.vehiculo && (
      <article key={order.vehiculo.placa}>
        <h2>{order.vehiculo.marca} : {order.vehiculo.modelo}</h2>
        <p>{order.comentarios}</p>
      </article>
    )
  )
}
