'use client'


import { useOrders } from '@/hooks/useOrders'
import { DataView } from 'primereact/dataview'
import { OrdenTrabajo } from './types'
import { ListOrders } from '@/components/listOrders'

export default function Home () {

  const { orders }: {orders: OrdenTrabajo[]}  = useOrders()
  console.log(orders)


  // const itemTemplate = (product, index) => {
  //   return (

  //   )
  // }

  // const listTemplate = (items) => {
  //   if (!items || items.length === 0) return null

  //   const list = items.map((product, index) => {
  //     return itemTemplate(product, index)
  //   })

  //   return <>{list}</>
  // }

  return ( orders &&
    <DataView value={orders} listTemplate={(items: OrdenTrabajo[]) => <ListOrders items={items} />}/>
  )
}
