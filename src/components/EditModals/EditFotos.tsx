import { ModalProps } from '@/app/types'
import { UploaderImages } from '../UploaderImages'

interface EditFotosProps {
    orderToEdit: ModalProps,
    setOrderToEdit: (modal: ModalProps) => void
}

export const EditFotos: React.FC<EditFotosProps> = ({orderToEdit}) => {
  if(!orderToEdit.fotos) return null
  return (
    <UploaderImages fotos={orderToEdit.fotos}/>
  )
}
