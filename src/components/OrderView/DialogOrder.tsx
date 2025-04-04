import { OrdenTrabajo } from "@/app/types"
import { useOrders } from "@/hooks/useOrders"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { Dialog } from "primereact/dialog"
import { useRef, useState } from "react"
import { OrderView } from "./OrderView"
import { HeaderOrderModal } from "./HeaderModal"
import { FooterModal } from "./FooterModal"
import { Toast } from "primereact/toast"
import { ProgressSpinner } from "primereact/progressspinner"
import { Button } from "primereact/button"

interface DialogOrderProps {
    editedOrder: OrdenTrabajo | null
    setEditedOrder: (order: OrdenTrabajo | null) => void
    onHide: () => void
    orderToShowInModal: OrdenTrabajo | null
    visible: boolean
}

export const DialogOrder: React.FC<DialogOrderProps> = ({ editedOrder, setEditedOrder, orderToShowInModal, visible, onHide }) => {

    const [isLoading, setIsLoading] = useState(false)
    const { saveEditedOrder, eliminateOrder, printOrder } = useOrders()
    const [edit, setEdit] = useState(false)
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [pdfGenerationStatus, setPdfGenerationStatus] = useState('');
    const toast = useRef<Toast>(null)

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

    const acceptDelete = async () => {
        if (!orderToShowInModal) return
        setIsLoading(true)
        const success = await eliminateOrder(orderToShowInModal.id)
        setIsLoading(false)
        if (success) {
            toast.current?.show({ severity: 'success', summary: 'Acción completada', detail: 'Orden eliminada con exito', life: 2000 })
            onHide()
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

    const handleHideModal = () => {
        if (!visible) return
        onHide()
        setEdit(false)
    }

    return (
        <>
            <Toast ref={toast} position='bottom-right' className='w-10 md:w-auto' />
            <ConfirmDialog />
            <Dialog visible={visible} maximizable style={{ width: '95vw' }} onHide={handleHideModal} header={<HeaderOrderModal edit={edit} editedOrder={editedOrder} />} contentClassName='px-0' footer={<FooterModal confirmDelete={confirmDelete} edit={edit} handleCancelEdit={handleCancelEdit} handleSaveEdit={handleSaveEdit} isLoading={isLoading} orderToShowInModal={orderToShowInModal} printOrderPDF={printOrderPDF} setEdit={setEdit} />} >
                <OrderView order={orderToShowInModal} edit={edit} editedOrder={editedOrder} setEditedOrder={setEditedOrder} setEdit={setEdit} />
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
    )
}