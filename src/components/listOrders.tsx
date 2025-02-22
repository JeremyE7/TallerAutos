import { OrdenTrabajo } from '@/app/types'
import { ListItemOrder } from './lisItemOrder'

import { ConfirmDialog } from 'primereact/confirmdialog' // For <ConfirmDialog /> component
import { confirmDialog } from 'primereact/confirmdialog' // For confirmDialog method
import { useRef, useState } from 'react'
import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { OrderView } from './OrderView'

interface ListOrdersProps {
    items: OrdenTrabajo[]
}
export const ListOrders = ({items} : ListOrdersProps) => {

  const toast = useRef<Toast>(null)
  const [visible, setVisible] = useState(false)
  const [orderToShowInModal, setOrderToShowInModal] = useState<OrdenTrabajo | null>(null)
  const accept = () => {
    toast.current?.show({ severity: 'success', summary: 'Acción completada', detail: 'Orden eliminada con exito', life: 1000 })
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
    if(visible) return
    setOrderToShowInModal(order)
    setVisible(true)
  }

  const hideModal = () => {
    if(!visible) return
    setVisible(false)
  }


  if (!items || items.length === 0) return null

  const list = items.map((order) => {
    return ListItemOrder({order: order, confirmDelete, showModal})
  })

  return <>
    <Toast ref={toast} position='bottom-right'/>
    <ConfirmDialog />
    {list}
    <Dialog visible={visible} maximizable style={{ width: '50vw' }} onHide={hideModal}>
      <OrderView order={orderToShowInModal}/>
    </Dialog>
  </>
}
