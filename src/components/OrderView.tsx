import { OrdenTrabajo } from '@/app/types'
import { Loader } from './Loader/Loader'

interface OrderViewProps {
    order: OrdenTrabajo | null
}
export const OrderView: React.FC<OrderViewProps> = ({order}) => {

  if (!order) return <Loader widthPercentaje={50} heightPercentaje={50}/>

  return (
    <section>
      <h1>Orden de trabajo</h1>
      <div>
        <h2>Cliente</h2>
        <p>Nombre: {order.vehiculo.cliente.nombre}</p>
        <p>Cedula: {order.vehiculo.cliente.cedula}</p>
        <p>Telefono: {order.vehiculo.cliente.telefono}</p>
      </div>
      <div>
        <h2>Automovil</h2>
        <p>Marca: {order.vehiculo.marca}</p>
        <p>Modelo: {order.vehiculo.modelo}</p>
        <p>Placa: {order.vehiculo.placa}</p>
      </div>
      <div>
        <h2>Orden de trabajo</h2>
        <p>Operaciones solicitadas: {order.operaciones_solicitadas}</p>
        <p>Comentarios: {order.comentarios}</p>
      </div>
    </section>
  )
}
