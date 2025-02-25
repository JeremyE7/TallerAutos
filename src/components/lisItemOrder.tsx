'use client'
import { OrdenTrabajo } from '@/app/types'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'

interface ListItemOrderProps {
  order: OrdenTrabajo
  confirmDelete: () => void,
  showModal: (order: OrdenTrabajo) => void,
}

export const ListItemOrder = ({ order, confirmDelete, showModal }: ListItemOrderProps) => {



  const header = (
    <div className='buttons mr-1 mt-2 md:mt-6 md:mr-3' style={{ float: 'right' }}>
      <div className='flex gap-2 flex-col flex-row'>
        <Button icon="pi pi-eye" onClick={() => showModal(order)} />
        <Button icon="pi pi-print" severity='help' />
        <Button severity="danger" icon="pi pi-trash" onClick={confirmDelete} />
      </div>
    </div>
  )

  return (
    <>
      {order.vehiculo && (
        <Card title={order.vehiculo.marca} subTitle={order.vehiculo.modelo} className='p-2 text-left border-round-2xl' key={order.vehiculo.placa} header={header}>
          <div className='grid w-full'>
            <div className='flex flex-column md:col-5 md:text-right sm:text-left sm:col-12'>
              <h5 className='text-primary'>
                {order.operaciones_solicitadas}
              </h5>
              <span>
                {order.comentarios}
              </span>
              <span>
                <b>Fecha de entrega: </b>{new Date(order.fechaSalida).toLocaleDateString()}
              </span>
            </div>
            <Divider layout="vertical" className='col-1 hidden md:flex' color='#ffd54f'>
              <span>Cliente</span>
            </Divider>
            <Divider layout="horizontal" className='col-12 flex md:hidden' color='#ffd54f'>
              <span>Cliente</span>
            </Divider>
            <div className='grid md:col-5 row-gap-3 p-0 m-0 sm:col-12'>
              <div className='label-show col-6'>
                <span className='label text-gray-400 text-xs font-bold'>Placa de Automovil:</span>
                <span className='value'>{order.vehiculo.placa}</span>
              </div>
              <div className='label-show col-6'>
                <span className='label text-gray-400 text-xs font-bold'>Nombre:</span>
                <span className='value'>{order.vehiculo.cliente.nombre}</span>
              </div>
              <div className='label-show col-6'>
                <span className='label text-gray-400 text-xs font-bold'>Cedula:</span>
                <span className='value'>{order.vehiculo.cliente.cedula}</span>
              </div>
              <div className='label-show col-6'>
                <span className='label text-gray-400 text-xs font-bold'>Teléfono:</span>
                <span className='value'>{order.vehiculo.cliente.telefono}</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
