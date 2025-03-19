import { EstadosOrden, OrdenTrabajo } from '@/app/types'
import { ListItemOrder } from './lisItemOrder'

import { ConfirmDialog } from 'primereact/confirmdialog' // For <ConfirmDialog /> component
import { confirmDialog } from 'primereact/confirmdialog' // For confirmDialog method
import { useRef, useState } from 'react'
import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { OrderView } from './OrderView'
import { Button } from 'primereact/button'
import { ChipOrderState } from './ChipOrderState'
import { SearchOrders } from './SearchOrders'
import OrdenTrabajoModal from './NewOrder'
interface ListOrdersProps {
  items: OrdenTrabajo[]
}
export const ListOrders = ({ items }: ListOrdersProps) => {

  const toast = useRef<Toast>(null)
  const [visible, setVisible] = useState(false)
  const [orderToShowInModal, setOrderToShowInModal] = useState<OrdenTrabajo | null>(null)
  const [newOrderModalVisible, setNewOrderModalVisible] = useState(false)
  const accept = () => {
    toast.current?.show({ severity: 'success', summary: 'Acción completada', detail: 'Orden eliminada con exito', life: 1000 })
    hideModal()
  }

  const confirmDelete = () => {
    confirmDialog({
      message: 'Estas seguro de que deseas eliminar esta orden?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept
    })
  }

  const showModal = (order: OrdenTrabajo) => {
    if (visible) return
    setOrderToShowInModal(order)
    setVisible(true)
  }

  const hideModal = () => {
    if (!visible) return
    setVisible(false)
  }

  const showNewOrderModal = () => {
    setNewOrderModalVisible(true) // Abre el modal de nueva orden
  }

  const hideNewOrderModal = () => {
    setNewOrderModalVisible(false) // Cierra el modal de nueva orden
  }
  if (!items || items.length === 0) return null

  const list = items.map((order) => {
    return <ListItemOrder key={order.id} order={order} confirmDelete={confirmDelete} showModal={showModal} />
  })

  const FooterModal = () => {
    return (
      <section className='flex gap-1.5 drop-shadow-lg pt-3'>
        <Button icon='pi pi-pencil' severity='warning' className={'w-2 md:w-1 ' + ((orderToShowInModal?.estado !== EstadosOrden.FINALIZADA) ? '' : 'hidden  ')} />
        <Button icon='pi pi-print' severity='help' className='w-2 md:w-1' />
        <Button icon='pi pi-trash' severity='danger' className='w-2 ml-auto md:w-1' onClick={confirmDelete} />
      </section>
    )
  }

  const HeaderModal = () => {
    return <div className='flex justify-center items-center flex-col md:flex-row gap-3'>
      <h1 className='text-4xl text-primary font-bold'>
        Orden de trabajo N°{orderToShowInModal?.id}
      </h1>
      <ChipOrderState state={orderToShowInModal?.estado ?? ''} />
    </div>
  }

  return <>
    <div className='flex row justify-between items-center w-full sticky top-0 z-10 pt-4' style={{ background: 'var(--surface-ground	)' }}>
      <SearchOrders />
      <Button onClick={showNewOrderModal} label='Crear orden' icon='pi pi-plus' className='p-button-raised p-button-rounded p-button-primary mt-2 shadow' />
    </div>

    <Toast ref={toast} position='bottom-right' className='w-10 md:w-auto' />
    <ConfirmDialog />
    {list}
    <Dialog visible={visible} maximizable style={{ width: '95vw' }} onHide={hideModal} header={HeaderModal} contentClassName='px-0' footer={<FooterModal />} >
      <OrderView order={orderToShowInModal} />
    </Dialog>

    <Dialog visible={newOrderModalVisible} style={{ width: '50vw' }} onHide={hideNewOrderModal} header="Nueva Orden">
      <OrdenTrabajoModal visible={newOrderModalVisible} onHide={hideNewOrderModal} />
    </Dialog>
  </>
}
