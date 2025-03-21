import { Cliente, ModalProps } from '@/app/types'
import { LabelShow } from '../LabelShow'

interface EditClientProps {
    orderToEdit: ModalProps,
    setOrderToEdit: (modal: ModalProps) => void
}


export const EditClient: React.FC<EditClientProps> = ({ orderToEdit, setOrderToEdit }) => {

  const handleOnChange = (value: string, key: keyof Cliente) => {
    if(!orderToEdit.cliente) return
    setOrderToEdit({ ...orderToEdit, cliente: {
      ...orderToEdit.cliente,
      [key]: value
    } })
  }

  return (
    <div className='label-show-container text-center'>
      <LabelShow label='Nombre' value={orderToEdit.cliente?.nombre} editable onChange={(value) => handleOnChange(value, 'nombre')}/>
      <LabelShow label='Email' value={orderToEdit.cliente?.email} editable onChange={(value) => handleOnChange(value, 'email')}/>
      <LabelShow label='CI/RUC' value={orderToEdit.cliente?.cedula} editable onChange={(value) => handleOnChange(value, 'cedula')}/>
      <LabelShow label='Tel. Celular:' value={orderToEdit.cliente?.telefono} editable onChange={(value) => handleOnChange(value, 'telefono')}/>
      <LabelShow label='Dirección' value={orderToEdit.cliente?.direccion} editable onChange={(value) => handleOnChange(value, 'direccion')}/>
    </div>
  )
}
