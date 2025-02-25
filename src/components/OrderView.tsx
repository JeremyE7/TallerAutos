import { OrdenTrabajo } from '@/app/types'
import { Loader } from './Loader/Loader'
import { Divider } from 'primereact/divider'
import GalleryyOrder from './GalleryOrder'
import { LabelShow } from './LabelShow'
import { ElementosIngresoView } from './ElementosIngresoView'
import { Knob } from 'primereact/knob'
import { FormaPago } from './FormaPago'
import { TextAreaShow } from './TextAreaShow'

interface OrderViewProps {
  order: OrdenTrabajo | null
}
export const OrderView: React.FC<OrderViewProps> = ({ order }) => {

  if (!order) return <Loader widthPercentaje={50} heightPercentaje={50} />
  console.log(order)

  return (
    <article>
      <section>
        <Divider align='left'><h2 className='text-left text-2xl'>Imagenes</h2></Divider>
        {order.foto ? (
          <GalleryyOrder orderPhotos={order.foto}/>
        ): (
          <p>No hay imagenes disponibles</p>
        )}
      </section>
      <section className=''>
        <Divider align='left'><h2 className='text-left text-2xl'>Cliente</h2></Divider>
        <div className='label-show-container text-center'>
          <LabelShow label='Nombre' value={order.vehiculo.cliente.nombre} />
          <LabelShow label='Email' value={order.vehiculo.cliente.email} />
          <LabelShow label='CI/RUC' value={order.vehiculo.cliente.cedula} />
          <LabelShow label='Tel. Celular' value={order.vehiculo.cliente.telefono} />
          <LabelShow label='Dirección' value={order.vehiculo.cliente.direccion} />
          <LabelShow label='Fecha de Ingreso' value={order.fechaIngreso.toString()} />
        </div>
      </section>
      <section className='mt-4'>
        <Divider align='left'><h2 className='text-left text-2xl '>Automovil</h2></Divider>
        <div className='label-show-container text-center'>
          <LabelShow label='Marca' value={order.vehiculo.marca} />
          <LabelShow label='Motor' value={order.vehiculo.motor} />
          <LabelShow label='Modelo' value={order.vehiculo.modelo} />
          <LabelShow label='Color' value={order.vehiculo.color} />
          <LabelShow label='Año' value={order.vehiculo.anio} />
          <LabelShow label='Placa' value={order.vehiculo.placa} />
          <LabelShow label='Chasis' value={order.vehiculo.chasis} />
          <LabelShow label='Km' value={order.vehiculo.kilometraje} />
        </div>
      </section>
      <section className='mt-4'>
        <Divider align='left'><h2 className='text-left text-2xl '>Elementos de ingreso</h2></Divider>
        <div className='view-elementos-ingreso-container'>
          <ElementosIngresoView elements={order.elementosIngreso} />
          <div className='nob-container'>
            <Knob value={order.vehiculo.combustible ?? 100} readOnly />
            <h2>Gasolina</h2>
          </div>
        </div>
      </section>
      <section className='mt-4'>
        <Divider align='left'><h2 className='text-left text-2xl'>Orden de Trabajo</h2></Divider>
        <div className='label-show-container text-center ml-0'>
          <LabelShow label='Operaciones solicitadas' value={order.operaciones_solicitadas} order='column'/>
        </div>
      </section>
      <section className='mt-4'>
        <Divider align='left'><h2 className='text-left text-2xl'>Forma de Pago</h2></Divider>
        <div className='flex justify-center gap-10 flex-col'>
          <FormaPago order={order} />
          <div className='flex w-full justify-evenly flex-col md:flex-row'>
            <div className='label-show-container text-center m-0'>
              <LabelShow label='Total M/O' value={order.total_mo} />
              <LabelShow label='Total REP' value={order.total_rep} />
              <LabelShow label='IVA' value={order.iva} />
              <LabelShow label='TOTAL' value={order.total} />
            </div>
            <div className='text-area-show-container text-center mt-10 items-start md:mt-0'>
              <TextAreaShow label='Comentarios' value={order.comentarios} order='column'/>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
