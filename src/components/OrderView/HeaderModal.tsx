import { Chip } from 'primereact/chip'
import { ChipOrderState } from '../ChipOrderState'
import { OrdenTrabajo } from '@/app/types'

interface HeaderOrderModalProps {
    editedOrder: OrdenTrabajo | null
    edit: boolean
}

export const HeaderOrderModal: React.FC<HeaderOrderModalProps> = ({editedOrder, edit}) => {
  return <div className='flex justify-center items-center flex-col md:flex-row gap-3'>
    <h1 className='text-4xl text-primary font-bold'>
            Orden de trabajo N°{editedOrder?.id}
    </h1>
    {!edit ? <ChipOrderState state={editedOrder?.estado ?? ''} /> : (
      <Chip label={'Editando'} className='bg-primary-reverse' />
    )}
  </div>
}
