'use client'


import { useOrders } from '@/hooks/useOrders'
import { DataView } from 'primereact/dataview'
import { OrdenTrabajo } from './types'
import { ListOrders } from '@/components/listOrders'
import { Loader } from '@/components/Loader/Loader'
import { useEffect, useState } from 'react'
import { SearchOrders } from '@/components/SearchOrders'
import { Button } from 'primereact/button'

export default function Home () {
  const [isLoading, setIsLoading] = useState(true)
  const { filteredOrders } = useOrders()

  useEffect(() => {
    if (filteredOrders && filteredOrders.length > 0) {
      setIsLoading(false)
    }
  }, [filteredOrders])

  return (
    <>
      {(isLoading) ? <Loader widthPercentaje={10} heightPercentaje={50} /> :
        (
          <>
            <div className='flex row justify-between items-center w-full sticky top-0 z-10 pt-4 pb-2 shadow px-10 md:px-50!' style={{ background: 'var(--surface-ground	)' }}>
              <SearchOrders />
              <Button label='' icon='pi pi-plus' className='p-button-raised p-button-primary shadow' />
            </div>
            {filteredOrders.length === 0 ? <h1>No se encontraron resultados</h1> :
              <DataView value={filteredOrders} listTemplate={(items: OrdenTrabajo[]) => <ListOrders items={items} />} className='px-0 pb-5 gap-2 w-10' paginator rows={5} paginatorClassName='mt-10 rounded-lg!' />
            }
          </>
        )
      }
    </>
  )
}
