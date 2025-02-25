import { EstadosOrden, OrdenTrabajo } from '@/app/types'
import { ListItemOrder } from './lisItemOrder'

import { ConfirmDialog } from 'primereact/confirmdialog' // For <ConfirmDialog /> component
import { confirmDialog } from 'primereact/confirmdialog' // For confirmDialog method
import { useRef, useState } from 'react'
import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { OrderView } from './OrderView'
import { Button } from 'primereact/button'

interface ListOrdersProps {
  items: OrdenTrabajo[]
}
export const ListOrders = ({ items }: ListOrdersProps) => {

  const toast = useRef<Toast>(null)
  const [visible, setVisible] = useState(false)
  const [orderToShowInModal, setOrderToShowInModal] = useState<OrdenTrabajo | null>(null)
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


  if (!items || items.length === 0) return null

  const list = items.map((order) => {
    return <ListItemOrder key={order.id} order={order} confirmDelete={confirmDelete} showModal={showModal} />
  })

  const FooterModal = () => {
    return(
      <section className='flex gap-1.5 drop-shadow-lg pt-3'>
        <Button icon='pi pi-pencil' severity='warning' className={'w-2 md:w-1 ' + ((orderToShowInModal?.estado !== EstadosOrden.FINALIZADA) ? '' : 'hidden  ')} />
        <Button icon='pi pi-print' severity='help' className='w-2 md:w-1' />
        <Button icon='pi pi-trash' severity='danger' className='w-2 ml-auto md:w-1' onClick={confirmDelete}/>
      </section>
    )
  }

  return <>
    <Toast ref={toast} position='bottom-right' />
    <ConfirmDialog />
    {list}
    <Dialog visible={visible} maximizable style={{ width: '95vw' }} onHide={hideModal} header={<h1 className='text-4xl text-primary font-bold'>Orden de trabajo N°{orderToShowInModal?.id}</h1>} contentClassName='px-0' footer={<FooterModal/> } >
      <OrderView order={orderToShowInModal} />
    </Dialog>
  </>
}
