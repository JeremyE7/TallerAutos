import { MetodoPago, OrdenTrabajo } from '@/app/types'
import { Checkbox } from 'primereact/checkbox'
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton'

interface FormaPagoProps {
    order: OrdenTrabajo | null
    editable?: boolean
    onChange?: (value: string) => void
}

export const FormaPago: React.FC<FormaPagoProps> = ({ order, editable, onChange }) => {

  const handleChange = (e: RadioButtonChangeEvent) => {
    const { value } = e.target

    if(!order) return

    if (value === MetodoPago.EFECTIVO) {
      onChange?.(MetodoPago.EFECTIVO)

    } else {
      onChange?.(MetodoPago.TARJETA_CREDITO)
    }
  }

  return (
    <>
      {editable ? (
        <div className="flex flex-row gap-10 justify-center">
          <div className="flex align-items-center">
            <RadioButton inputId="efectivo" name="efectivo" value={MetodoPago.EFECTIVO}  checked={order?.forma_pago === MetodoPago.EFECTIVO} onChange={handleChange}/>
            <label htmlFor="efectivo" className="ml-2">Efectivo</label>
          </div>
          <div className="flex align-items-center">
            <RadioButton inputId="credito" name="credito" value={MetodoPago.TARJETA_CREDITO}  checked={order?.forma_pago === MetodoPago.TARJETA_CREDITO} onChange={handleChange}/>
            <label htmlFor="credito" className="ml-2">Tarjeta de Crédito</label>
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-10 justify-center">
          <div className="flex align-items-center">
            <Checkbox inputId="ingredient1" name="pizza" value="Cheese"  checked={order?.forma_pago === MetodoPago.EFECTIVO} disabled={!(order?.forma_pago === MetodoPago.EFECTIVO)}/>
            <label htmlFor="ingredient1" className="ml-2">Efectivo</label>
          </div>
          <div className="flex align-items-center">
            <Checkbox inputId="ingredient2" name="pizza" value="Mushroom" checked={order?.forma_pago === MetodoPago.TARJETA_CREDITO}  disabled={!(order?.forma_pago === MetodoPago.TARJETA_CREDITO)}/>
            <label htmlFor="ingredient2" className="ml-2">Tarjeta de Crédito</label>
          </div>
        </div>
      )
      }
    </>
  )
}
