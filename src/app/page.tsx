'use client'


import { useOrders } from '@/hooks/useOrders'
import { DataView } from 'primereact/dataview'
import { OrdenTrabajo } from './types'
import { ListOrders } from '@/components/listOrders'
import { Loader } from '@/components/Loader/Loader'
import { useEffect, useState } from 'react'
import { SearchOrders } from '@/components/SearchOrders'
import { Button } from 'primereact/button'
import OrdenTrabajoModal from '@/components/NewOrder'
import { useClients } from '@/hooks/useClients'
import { useVehicle } from '@/hooks/useVehicle'

export default function Home () {
  const [newOrderModalVisible, setNewOrderModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { filteredOrders } = useOrders()
  const {clients} = useClients()
  const { vehicles } = useVehicle()

  useEffect(() => {
    if (filteredOrders && filteredOrders.length > 0 && clients.length > 0 && vehicles.length > 0) {
      setIsLoading(false)
    }
  }, [filteredOrders, clients, vehicles])

  const showNewOrderModal = () => {
    setNewOrderModalVisible(true) // Abre el modal de nueva orden
  }

  const hideNewOrderModal = () => {
    setNewOrderModalVisible(false) // Cierra el modal de nueva orden
  }


  return (
    <>
      {(isLoading) ? <Loader widthPercentaje={10} heightPercentaje={50} /> :
        (
          <>
            <div className='flex row justify-between items-center w-full sticky top-0 z-10 pt-4 pb-2 px-10 md:px-50!' style={{ background: 'var(--surface-0	)' }}>
              <SearchOrders />
              <Button label='' icon='pi pi-plus' className='p-button-raised p-button-primary shadow' onClick={showNewOrderModal}/>
            </div>
            {filteredOrders.length === 0 ? <h1>No se encontraron resultados</h1> :
              <DataView value={filteredOrders} listTemplate={(items: OrdenTrabajo[]) => <ListOrders items={items} />} className='px-0 pb-5 gap-2 w-10' paginator rows={5} paginatorClassName='mt-10 rounded-lg!' />
            }
            <OrdenTrabajoModal visible={newOrderModalVisible} onHide={hideNewOrderModal} />
          </>
        )
      }
    </>
  )
}
