import { OrdenTrabajo } from '@/app/types'
import { ListItemOrder } from './lisItemOrder'

import { ConfirmDialog } from 'primereact/confirmdialog' // For <ConfirmDialog /> component
import { confirmDialog } from 'primereact/confirmdialog' // For confirmDialog method
import { useRef, useState } from 'react'
import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'

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

  const showModal = () => {
    if(visible) return
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
    <Dialog header="Header" visible={visible} maximizable style={{ width: '50vw' }} onHide={hideModal}>
      <p className="m-0">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </Dialog>
  </>
}
