'use client'


import { useOrders } from '@/hooks/useOrders'
import { DataView } from 'primereact/dataview'
import { OrdenTrabajo } from './types'
import { ListOrders } from '@/components/listOrders'
import { Loader } from '@/components/Loader/Loader'

export default function Home () {
  const { orders, isLoading } = useOrders()
  console.log(orders)

  return (
    <>
      {isLoading ? <Loader widthPercentaje={10} heightPercentaje={50} /> :
        (orders &&
          <DataView value={orders} listTemplate={(items: OrdenTrabajo[]) => <ListOrders items={items} />} className='w-full px-5 pb-5 gap-2 w-10'  />
        )
      }
    </>
  )
}
