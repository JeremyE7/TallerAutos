'use client'


import { useOrders } from '@/hooks/useOrders'
import { DataView } from 'primereact/dataview'
import { OrdenTrabajo } from './types'
import { ListOrders } from '@/components/listOrders'
import { Loader } from '@/components/Loader/Loader'
import { useEffect, useState } from 'react'

export default function Home () {
  const [isLoading, setIsLoading] = useState(true)
  const { orders } = useOrders()
  console.log(orders)

  useEffect(() => {
    if (orders) {
      setIsLoading(false)
    }
  }, [orders])

  return (
    <>
      {isLoading ? <Loader widthPercentaje={10} heightPercentaje={50} /> :
        (orders && orders.length > 0) ? (
          <DataView value={orders} listTemplate={(items: OrdenTrabajo[]) => <ListOrders items={items} />} className='px-0 pb-5 gap-2 w-10' paginator rows={5} />
        ) : (<Loader widthPercentaje={10} heightPercentaje={50} />)
      }
    </>
  )
}
