import { EstadosOrden, OrdenTrabajo } from "@/app/types"
import { Button } from "primereact/button"

interface FooterModalProps {
    isLoading: boolean
    edit: boolean
    orderToShowInModal: OrdenTrabajo | null
    handleSaveEdit: () => void
    handleCancelEdit: () => void
    confirmDelete: () => void
    printOrderPDF: (order: OrdenTrabajo) => void
    setEdit: (edit: boolean) => void
}

export const FooterModal:React.FC<FooterModalProps> = ({confirmDelete, edit, handleCancelEdit, handleSaveEdit, isLoading, orderToShowInModal, printOrderPDF, setEdit}) => {
    if (isLoading) {
        return (
            <section className='flex justify-center overflow-hidden'>
                <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: 'var(--primary-color)', overflow: 'hidden' }}></i>
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