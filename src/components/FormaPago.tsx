import { MetodoPago, OrdenTrabajo } from '@/app/types'
import { Checkbox } from 'primereact/checkbox'
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton'
import { useState } from 'react'

interface FormaPagoProps {
    order: OrdenTrabajo | null,
    editable?: boolean
}

export const FormaPago: React.FC<FormaPagoProps> = ({ order, editable }) => {

  const [selectedValue, setSelectedValue] = useState<string | undefined>(order?.forma_pago)

  const handleChange = (e: RadioButtonChangeEvent) => {
    const { value } = e.target

    if(!order) return

    if (value === MetodoPago.EFECTIVO) {
      setSelectedValue(MetodoPago.EFECTIVO)

    } else {
      setSelectedValue(MetodoPago.TARJETA_CREDITO)
    }

  }

  return (
    <>
      {editable ? (
        <div className="flex flex-row gap-10 justify-center">
          <div className="flex align-items-center">
            <RadioButton inputId="efectivo" name="efectivo" value={MetodoPago.EFECTIVO}  checked={selectedValue === MetodoPago.EFECTIVO} onChange={handleChange}/>
            <label htmlFor="efectivo" className="ml-2">Efectivo</label>
          </div>
          <div className="flex align-items-center">
            <RadioButton inputId="credito" name="credito" value={MetodoPago.TARJETA_CREDITO}  checked={selectedValue === MetodoPago.TARJETA_CREDITO} onChange={handleChange}/>
            <label htmlFor="credito" className="ml-2">Tarjeta de Crédito</label>
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-10 justify-center">
          <div className="flex align-items-center">
            <Checkbox inputId="ingredient1" name="pizza" value="Cheese"  checked={selectedValue === MetodoPago.EFECTIVO} disabled={!(order?.forma_pago === MetodoPago.EFECTIVO)}/>
            <label htmlFor="ingredient1" className="ml-2">Efectivo</label>
          </div>
          <div className="flex align-items-center">
            <Checkbox inputId="ingredient2" name="pizza" value="Mushroom" checked={selectedValue === MetodoPago.TARJETA_CREDITO}  disabled={!(order?.forma_pago === MetodoPago.TARJETA_CREDITO)}/>
            <label htmlFor="ingredient2" className="ml-2">Tarjeta de Crédito</label>
          </div>
        </div>
      )
      }
    </>
  )
}
