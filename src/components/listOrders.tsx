import { EstadosOrden, OrdenTrabajo } from '@/app/types'
import { ListItemOrder } from './lisItemOrder'

import { ConfirmDialog } from 'primereact/confirmdialog' // For <ConfirmDialog /> component
import { confirmDialog } from 'primereact/confirmdialog' // For confirmDialog method
import { useEffect, useRef, useState } from 'react'
import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { OrderView } from './OrderView'
import { Button } from 'primereact/button'
import { ChipOrderState } from './ChipOrderState'
import { SearchOrders } from './SearchOrders'
import { Chip } from 'primereact/chip'
import { useOrders } from '@/hooks/useOrders'

interface ListOrdersProps {
  items: OrdenTrabajo[]
}
export const ListOrders = ({ items }: ListOrdersProps) => {

  const [visible, setVisible] = useState(false)
  const [orderToShowInModal, setOrderToShowInModal] = useState<OrdenTrabajo | null>(null)
  const [editedOrder, setEditedOrder] = useState<OrdenTrabajo | null>(orderToShowInModal)
  const [edit, setEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const {saveEditedOrder, eliminateOrder} = useOrders()
  const toast = useRef<Toast>(null)

  useEffect(() => {
    setEditedOrder(orderToShowInModal)
  },[orderToShowInModal])


  const acceptDelete = async () => {
    if(!orderToShowInModal) return
    console.log('Deleting order:', orderToShowInModal.id)

    setIsLoading(true)
    const success = await eliminateOrder(orderToShowInModal.id)
    setIsLoading(false)
    if(success){
      toast.current?.show({ severity: 'success', summary: 'Acción completada', detail: 'Orden eliminada con exito', life: 2000 })
      hideModal()
    }else{
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la orden', life: 2000 })
    }
  }

  const confirmDelete = () => {
    confirmDialog({
      message: 'Estas seguro de que deseas eliminar esta orden?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: acceptDelete
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
    setEdit(false)
  }


  if (!items || items.length === 0) return <h1>No se encontraron resultados</h1>

  const list = items.map((order) => {
    return <ListItemOrder key={order.id} order={order} confirmDelete={confirmDelete} showModal={showModal} />
  })


  const handleSaveEdit = async () => {
    if(!editedOrder) return
    setIsLoading(true)
    const succesEditedOrder = await saveEditedOrder(editedOrder)
    setIsLoading(false)
    if(succesEditedOrder){
      toast.current?.show({ severity: 'success', summary: 'Acción completada', detail: 'Orden editada con exito', life: 1000 })
      setEdit(false)
    }else{
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al editar la orden', life: 1000 })
    }
  }

  const handleCancelEdit = () => {
    setEdit(false)
    setEditedOrder(orderToShowInModal)
  }

  const FooterModal = () => {
    if(isLoading){
      return(
        <section className='flex justify-center pt-3'>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
        </section>
      )
    }
    if(edit){
      return(
        <section className='flex justify-evenly pt-3'>
          <Button icon='pi pi-save' severity='warning' className={'w-2 md:w-1 ' + ((orderToShowInModal?.estado !== EstadosOrden.FINALIZADA) ? '' : 'hidden  ')} onClick={handleSaveEdit}/>
          <Button icon='pi pi-times' severity='danger' className='w-2 md:w-1' onClick={handleCancelEdit} />
        </section>
      )
    }
    return (
      <section className='flex gap-1.5 drop-shadow-lg pt-3'>
        <Button icon='pi pi-pencil' severity='warning' className={'w-2 md:w-1 ' + ((orderToShowInModal?.estado !== EstadosOrden.FINALIZADA) ? '' : 'hidden  ')} onClick={() => setEdit(true)}/>
        <Button icon='pi pi-print' severity='help' className='w-2 md:w-1' />
        <Button icon='pi pi-trash' severity='danger' className='w-2 ml-auto md:w-1' onClick={confirmDelete} />
      </section>
    )
  }

  const HeaderModal = () => {
    console.log(editedOrder?.estado)

    return <div className='flex justify-center items-center flex-col md:flex-row gap-3'>
      <h1 className='text-4xl text-primary font-bold'>
        Orden de trabajo N°{editedOrder?.id}
      </h1>
      {!edit ? <ChipOrderState state={editedOrder?.estado ?? ''} /> : (
        <Chip label={'Editando'} className='bg-primary-reverse' />
      )}
    </div>
  }

  return <>
    <Toast ref={toast} position='bottom-right' className='w-10 md:w-auto' />
    <ConfirmDialog />
    {list}
    <Dialog visible={visible} maximizable style={{ width: '95vw' }} onHide={hideModal} header={HeaderModal} contentClassName='px-0' footer={<FooterModal />} >
      <OrderView order={orderToShowInModal} edit={edit} editedOrder={editedOrder} setEditedOrder={setEditedOrder}/>
    </Dialog>
  </>
}
