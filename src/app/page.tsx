'use client'

import { useOrders } from '@/hooks/useOrders'
import { DataView } from 'primereact/dataview'
import { OrdenTrabajo } from './types'
import { ListOrders } from '@/components/listOrders'
import { Loader } from '@/components/Loader/Loader'
import { useEffect, useState, useRef } from 'react'
import { SearchOrders } from '@/components/SearchOrders'
import { Button } from 'primereact/button'
import OrdenTrabajoModal from '@/components/NewOrder'
import { useClients } from '@/hooks/useClients'
import { useVehicle } from '@/hooks/useVehicle'
import { useRouter } from 'next/compat/router'
import { OrderView } from '@/components/OrderView/OrderView'
import { DialogOrder } from '@/components/OrderView/DialogOrder'
import { settingsStore } from '@/store/settingsStore'
import { Toast } from 'primereact/toast'
export default function Home() {
  const router = useRouter();
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
  const id = searchParams.get('id') // Obtener el id de la URL
  const [orderToShowInModal, setOrderToShowInModal] = useState<OrdenTrabajo | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editedOrder, setEditedOrder] = useState<OrdenTrabajo | null>(null)

  const { orders } = useOrders()
  console.log('ID desde la URL:', id) // Verificar el valor del id

  useEffect(() => {
    if (!orders || !id) return
    const order = orders.find((order) => order.id === parseInt(id!)) // Buscar la orden por id en el array de orders
    if (order) {
      setOrderToShowInModal(order) // Si existe, asignarla al estado
      setEditedOrder(order)
      setModalOpen(true) // Abrir el modal
    }
    else {
      setModalOpen(false) // Si no existe, cerrar el modal
      toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Esta orden no existe o fue eliminada', life: 3000 })
    }
  }, [orders, id]) // Dependencias del useEffect



  const cerrarModal = () => {
    setModalOpen(false)
    setOrderToShowInModal(null)
    router?.push('/') // o a la ruta base, sin ?id
  }
  const [newOrderModalVisible, setNewOrderModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { filteredOrders } = useOrders()
  const { clients } = useClients()
  const { vehicles } = useVehicle()
  const { error, clearMessages } = settingsStore()
  const toastRef = useRef<Toast>(null)


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

  useEffect(() => {
    if (error) {
      toastRef.current?.show({ severity: 'error', summary: 'Error', detail: error, life: 3000 })
    }
  }, [error])


  return (
    <>
      {(isLoading) ? <Loader widthPercentaje={10} heightPercentaje={50} /> :
        (
          <>
            <div className='flex row justify-between items-center w-full sticky top-0 z-10 pt-4 pb-2 px-10 md:px-50!' style={{ background: 'var(--surface-0	)' }}>
              <SearchOrders />
              <Button label='' icon='pi pi-plus' className='p-button-raised p-button-primary shadow' onClick={showNewOrderModal} />
            </div>
            {filteredOrders.length === 0 ? <h1>No se encontraron resultados</h1> :
              <DataView value={filteredOrders} listTemplate={(items: OrdenTrabajo[]) => <ListOrders items={items} />} className='px-0 pb-5 gap-2 w-10' paginator rows={5} paginatorClassName='mt-10 rounded-lg!' />
            }
            <OrdenTrabajoModal visible={newOrderModalVisible} onHide={hideNewOrderModal} />
            <DialogOrder
              editedOrder={editedOrder}
              setEditedOrder={setEditedOrder}
              orderToShowInModal={orderToShowInModal}
              visible={modalOpen}
              onHide={() => setModalOpen(false)}
            />
            <Toast ref={toastRef} position='bottom-right' className='w-10 md:w-auto' onHide={clearMessages} onRemove={clearMessages} baseZIndex={999999999999999} />
          </>
        )
      }
    </>
  )
}
