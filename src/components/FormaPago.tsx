import { MetodoPago, OrdenTrabajo } from '@/app/types'
import { Checkbox } from 'primereact/checkbox'

interface FormaPagoProps {
    order: OrdenTrabajo | null,
    readonly?: boolean
}

export const FormaPago: React.FC<FormaPagoProps> = ({ order }) => {

  return (
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
