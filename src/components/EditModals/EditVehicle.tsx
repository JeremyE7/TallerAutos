import { ModalProps, Vehiculo } from '@/app/types'
import { LabelShow } from '../LabelShow'

interface EditVehicleProps {
    orderToEdit: ModalProps,
    setOrderToEdit: (modal: ModalProps) => void
}

export const EditVehicle: React.FC<EditVehicleProps> = ({ orderToEdit, setOrderToEdit }) => {

  const handleOnChange = (value: string, key: keyof Vehiculo) => {
    if(!orderToEdit.vehiculo) return
    setOrderToEdit({ ...orderToEdit, vehiculo: {
      ...orderToEdit.vehiculo,
      [key]: value
    } })
  }

  return (
    <div className='label-show-container text-center'>
      <LabelShow label='Marca' value={orderToEdit.vehiculo?.marca} editable onChange={(value) => handleOnChange(value, 'marca')} />
      <LabelShow label='Motor' value={orderToEdit.vehiculo?.motor} editable onChange={(value) => handleOnChange(value, 'motor')}/>
      <LabelShow label='Modelo' value={orderToEdit.vehiculo?.modelo} editable onChange={(value) => handleOnChange(value, 'modelo')} />
      <LabelShow label='Color' value={orderToEdit.vehiculo?.color} editable onChange={(value) => handleOnChange(value, 'color')}/>
      <LabelShow label='Año' value={orderToEdit.vehiculo?.anio} editable onChange={(value) => handleOnChange(value, 'anio')}/>
      <LabelShow label='Placa' value={orderToEdit.vehiculo?.placa} editable onChange={(value) => handleOnChange(value, 'placa')}/>
      <LabelShow label='Chasis' value={orderToEdit.vehiculo?.chasis} editable onChange={(value) => handleOnChange(value, 'chasis')}/>
      <LabelShow label='Km' value={orderToEdit.vehiculo?.kilometraje} editable onChange={(value) => handleOnChange(value, 'kilometraje')}/>
    </div>
  )
}
