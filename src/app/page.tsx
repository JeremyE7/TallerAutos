'use client'


import { useOrders } from '@/hooks/useOrders'
import { DataView } from 'primereact/dataview'
import { OrdenTrabajo } from './types'
import { ListOrders } from '@/components/listOrders'
import { Loader } from '@/components/Loader/Loader'
import { useEffect, useState } from 'react'

export default function Home () {
  const [isLoading, setIsLoading] = useState(true)
  const { filteredOrders } = useOrders()

  useEffect(() => {
    if (filteredOrders) {
      setIsLoading(false)
    }
  }, [filteredOrders])

  return (
    <>
      {isLoading ? <Loader widthPercentaje={10} heightPercentaje={50} /> :
        (filteredOrders && filteredOrders.length > 0) ? (
          <DataView value={filteredOrders} listTemplate={(items: OrdenTrabajo[]) => <ListOrders items={items} />} className='px-0 pb-5 gap-2 w-10' paginator rows={5} paginatorClassName='mt-10 rounded-lg!'/>
        ) : (<Loader widthPercentaje={10} heightPercentaje={50} />)
      }
    </>
  )
}
