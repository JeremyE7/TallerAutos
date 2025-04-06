import { OrdenTrabajo } from '@/app/types'
import { ListItemOrder } from './lisItemOrder'
import { ProgressSpinner } from 'primereact/progressspinner';

import { confirmDialog } from 'primereact/confirmdialog' // For confirmDialog method
import { useEffect, useState } from 'react'
import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { useOrders } from '@/hooks/useOrders'
import { DialogOrder } from './OrderView/DialogOrder';
import { settingsStore } from '@/store/settingsStore';

interface ListOrdersProps {
  items: OrdenTrabajo[]
}
export const ListOrders = ({ items }: ListOrdersProps) => {

  const [visible, setVisible] = useState(false)
  const [orderToShowInModal, setOrderToShowInModal] = useState<OrdenTrabajo | null>(null)
  const [editedOrder, setEditedOrder] = useState<OrdenTrabajo | null>(orderToShowInModal)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfGenerationStatus, setPdfGenerationStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const { eliminateOrder, printOrder } = useOrders()
  const {setSuccess, setError} = settingsStore()

  useEffect(() => {
    setEditedOrder(orderToShowInModal)
  }, [orderToShowInModal])


  const acceptDelete = async (order: OrdenTrabajo) => {    
    console.log('Eliminando orden', order);
    if (!order) return
    setIsLoading(true)
    const success = await eliminateOrder(order.id)
    if (success) {
      setSuccess('Orden eliminada con éxito')
      hideModal()
    } else {
      setError('Error al eliminar la orden')
    }
    setIsLoading(false)
  }

  const confirmDelete = (order: OrdenTrabajo) => {
    confirmDialog({
      message: 'Estas seguro de que deseas eliminar esta orden?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: () => acceptDelete(order)
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
    return <ListItemOrder key={order.id} order={order} confirmDelete={(order: OrdenTrabajo) => confirmDelete(order)} showModal={showModal} printOrder={printOrderPDF}/>
  })

  if(isLoading) {
    return <div className='flex justify-content-center align-items-center h-screen'>
      <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" animationDuration=".5s" />
    </div>
  }

  return <>
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
