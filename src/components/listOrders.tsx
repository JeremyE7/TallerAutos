import { EstadosOrden, OrdenTrabajo } from '@/app/types'
import { ListItemOrder } from './lisItemOrder'
import { ProgressSpinner } from 'primereact/progressspinner';

import { ConfirmDialog } from 'primereact/confirmdialog' // For <ConfirmDialog /> component
import { confirmDialog } from 'primereact/confirmdialog' // For confirmDialog method
import { useEffect, useRef, useState } from 'react'
import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { OrderView } from './OrderView/OrderView'
import { Button } from 'primereact/button'
import { ChipOrderState } from './ChipOrderState'
import { Chip } from 'primereact/chip'
import { useOrders } from '@/hooks/useOrders'
import { HeaderOrderModal } from './OrderView/HeaderModal';
import { FooterModal } from './OrderView/FooterModal';
import { DialogOrder } from './OrderView/DialogOrder';

interface ListOrdersProps {
  items: OrdenTrabajo[]
}
export const ListOrders = ({ items }: ListOrdersProps) => {

  const [visible, setVisible] = useState(false)
  const [orderToShowInModal, setOrderToShowInModal] = useState<OrdenTrabajo | null>(null)
  const [editedOrder, setEditedOrder] = useState<OrdenTrabajo | null>(orderToShowInModal)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfGenerationStatus, setPdfGenerationStatus] = useState('');
  const { eliminateOrder, printOrder } = useOrders()
  const toast = useRef<Toast>(null)

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

  return <>
    <Toast ref={toast} position='bottom-right' className='w-10 md:w-auto' />
    <ConfirmDialog />
    {list}
    <DialogOrder editedOrder={editedOrder} onHide={hideModal} orderToShowInModal={orderToShowInModal} setEditedOrder={setEditedOrder} visible={visible} />

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
