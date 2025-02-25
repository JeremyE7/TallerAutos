import { EstadosOrden } from '@/app/types'
import { Chip } from 'primereact/chip'

interface ChipOrderStateProps {
    state: string
}

export const ChipOrderState: React.FC<ChipOrderStateProps> = ({ state }) => {
  const getColorState = (state: string) => {
    switch (state) {
    case EstadosOrden.CANCELADA:
      return 'bg-red-500 text-black'
    case EstadosOrden.EN_PROCESO:
      return 'bg-yellow-500 text-black'
    case EstadosOrden.FINALIZADA:
      return 'bg-green-500 text-black'
    case EstadosOrden.PENDIENTE:
      return 'bg-blue-500'
    default:
      return ''
    }
  }

  return <Chip label={state} className={getColorState(state) + ' ml-1'}/>
}
