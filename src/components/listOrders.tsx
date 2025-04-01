import { EstadosOrden, OrdenTrabajo } from '@/app/types'
import { ListItemOrder } from './lisItemOrder'
import { ProgressSpinner } from 'primereact/progressspinner';

import { ConfirmDialog } from 'primereact/confirmdialog' // For <ConfirmDialog /> component
import { confirmDialog } from 'primereact/confirmdialog' // For confirmDialog method
import { useEffect, useRef, useState } from 'react'
import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { OrderView } from './OrderView'
import { Button } from 'primereact/button'
import { ChipOrderState } from './ChipOrderState'
import { SearchOrders } from './SearchOrders'
import OrdenTrabajoModal from './NewOrder'
import { Chip } from 'primereact/chip'
import { useOrders } from '@/hooks/useOrders'

interface ListOrdersProps {
  items: OrdenTrabajo[]
}
export const ListOrders = ({ items }: ListOrdersProps) => {

  const [visible, setVisible] = useState(false)
  const [orderToShowInModal, setOrderToShowInModal] = useState<OrdenTrabajo | null>(null)
  const [newOrderModalVisible, setNewOrderModalVisible] = useState(false)
  const [editedOrder, setEditedOrder] = useState<OrdenTrabajo | null>(orderToShowInModal)
  const [edit, setEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfGenerationStatus, setPdfGenerationStatus] = useState('');
  const { saveEditedOrder, eliminateOrder, printOrder } = useOrders()
  const toast = useRef<Toast>(null)
  const accept = () => {
    toast.current?.show({ severity: 'success', summary: 'Acción completada', detail: 'Orden eliminada con exito', life: 1000 })
    hideModal()
  }
  useEffect(() => {
    setEditedOrder(orderToShowInModal)
  }, [orderToShowInModal])


  const acceptDelete = async () => {
    if (!orderToShowInModal) return
    setIsLoading(true)
    const success = await eliminateOrder(orderToShowInModal.id)
    setIsLoading(false)
    if (success) {
      toast.current?.show({ severity: 'success', summary: 'Acción completada', detail: 'Orden eliminada con exito', life: 2000 })
      hideModal()
    } else {
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

  const showNewOrderModal = () => {
    setNewOrderModalVisible(true) // Abre el modal de nueva orden
  }

  const hideNewOrderModal = () => {
    setNewOrderModalVisible(false) // Cierra el modal de nueva orden
  }

  if (!items || items.length === 0) return <h1>No se encontraron resultados</h1>

  const printOrderPDF = async (order: OrdenTrabajo) => {
    console.log('Printing order with ID:', order.id);
    console.log('Printing order:', orderToShowInModal);
    if (!order) return;

    setIsGeneratingPDF(true);
    setPdfGenerationStatus('Generando PDF...');

    try {
      await printOrder(order.id);
      setPdfGenerationStatus('¡PDF listo! La descarga comenzará automáticamente');

      // Cierra el modal después de un breve retraso
      setTimeout(() => {
        setIsGeneratingPDF(false);
      }, 1500);

    } catch (error) {
      setPdfGenerationStatus('Error al generar el PDF');
      setTimeout(() => {
        setIsGeneratingPDF(false);
      }, 2000);
      console.error('Error generating PDF:', error);
    }
  }
  const list = items.map((order) => {
    return <ListItemOrder key={order.id} order={order} confirmDelete={confirmDelete} showModal={showModal} printOrder={printOrderPDF} />
  })


  const handleSaveEdit = async () => {
    if (!editedOrder) return
    setIsLoading(true)
    const succesEditedOrder = await saveEditedOrder(editedOrder)
    setIsLoading(false)
    if (succesEditedOrder) {
      toast.current?.show({ severity: 'success', summary: 'Acción completada', detail: 'Orden editada con exito', life: 1000 })
      setEdit(false)
    } else {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al editar la orden', life: 1000 })
    }
  }

  const handleCancelEdit = () => {
    setEdit(false)
    setEditedOrder(orderToShowInModal)
  }

  const FooterModal = () => {
    if (isLoading) {
      return (
        <section className='flex justify-center pt-3'>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
        </section>
      )
    }
    if (edit) {
      return (
        <section className='flex justify-evenly pt-3'>
          <Button icon='pi pi-save' severity='warning' className={'w-2 md:w-1 ' + ((orderToShowInModal?.estado !== EstadosOrden.FINALIZADA) ? '' : 'hidden  ')} onClick={handleSaveEdit} />
          <Button icon='pi pi-times' severity='danger' className='w-2 md:w-1' onClick={handleCancelEdit} />
        </section>
      )
    }
    return (
      <section className='flex gap-1.5 drop-shadow-lg pt-3'>
        <Button icon='pi pi-pencil' severity='warning' className={'w-2 md:w-1 ' + ((orderToShowInModal?.estado !== EstadosOrden.FINALIZADA) ? '' : 'hidden  ')} onClick={() => setEdit(true)} />
        <Button icon='pi pi-print' severity='help' className='w-2 md:w-1' onClick={() => orderToShowInModal && printOrderPDF(orderToShowInModal)} />
        <Button icon='pi pi-trash' severity='danger' className='w-2 ml-auto md:w-1' onClick={confirmDelete} />
      </section>
    )
  }

  const HeaderModal = () => {

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
    <div className='flex row justify-between items-center w-full sticky top-0 z-10 pt-4' style={{ background: 'var(--surface-ground	)' }}>
      <SearchOrders />
      <Button onClick={showNewOrderModal} label='Crear orden' icon='pi pi-plus' className='p-button-raised p-button-rounded p-button-primary mt-2 shadow' />
    </div>

    <Toast ref={toast} position='bottom-right' className='w-10 md:w-auto' />
    <ConfirmDialog />
    {list}
    <Dialog visible={visible} maximizable style={{ width: '95vw' }} onHide={hideModal} header={HeaderModal} contentClassName='px-0' footer={<FooterModal />} >
      <OrderView order={orderToShowInModal} edit={edit} editedOrder={editedOrder} setEditedOrder={setEditedOrder} />
    </Dialog>

    <Dialog visible={newOrderModalVisible} style={{ width: '50vw' }} onHide={hideNewOrderModal} header="Nueva Orden">
      <OrdenTrabajoModal visible={newOrderModalVisible} onHide={hideNewOrderModal} />
    </Dialog>

    <Dialog
      visible={isGeneratingPDF}
      onHide={() => setIsGeneratingPDF(false)}
      closable={false}
      header="Generando documento"
      style={{ width: '400px' }}
    >
      <div className="flex flex-column align-items-center">
        <ProgressSpinner
          style={{ width: '50px', height: '50px' }}
          strokeWidth="4"
          animationDuration=".5s"
        />
        <p className="mt-4 text-center font-medium">
          {pdfGenerationStatus}
        </p>
        {pdfGenerationStatus.includes('Error') && (
          <Button
            label="Cerrar"
            icon="pi pi-times"
            className="p-button-text mt-3"
            onClick={() => setIsGeneratingPDF(false)}
          />
        )}
      </div>
    </Dialog>
  </>
}
