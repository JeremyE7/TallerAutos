'use client'
import { OrdenTrabajo } from '@/app/types'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'
import { Dropdown } from 'primereact/dropdown'
import { useEffect, useState } from 'react'
import { ChipOrderState } from './ChipOrderState'

interface ListItemOrderProps {
  order: OrdenTrabajo
  confirmDelete: () => void,
  showModal: (order: OrdenTrabajo) => void,
}

export const ListItemOrder = ({ order, confirmDelete, showModal }: ListItemOrderProps) => {

  const [selectedOption, setSelectedOption] = useState(null)
  const options = [
    { name: 'Ver', code: 'view' },
    { name: 'Imprimir', code: 'print' },
    { name: 'Eliminar', code: 'delete' }
  ]

  useEffect(() => {
    if (selectedOption === 'view') showModal(order)
    if (selectedOption === 'delete') confirmDelete()

  }, [selectedOption])

  const header = (
    <div className='buttons mr-1 mt-2 md:mt-6 md:mr-3 ' style={{ float: 'right' }}>
      <div className='gap-2 flex-row hidden md:flex'>
        <Button icon="pi pi-eye" onClick={() => showModal(order)} />
        <Button icon="pi pi-print" severity='help' />
        <Button severity="danger" icon="pi pi-trash" onClick={confirmDelete} />
      </div>
      <Dropdown value={selectedOption} onChange={(e) => {
        setSelectedOption(e.value.code)
      }} options={options} optionLabel="name"
      placeholder="" className="hiddeInput w-1 block md:hidden mt-3.5" dropdownIcon='pi pi-ellipsis-v' onShow={() => setSelectedOption(null)} onHide={() => setSelectedOption(null)} />
    </div>
  )

  return (
    <>
      {order.vehiculo && (
        <Card title={<div className='flex gap-3'>{order.vehiculo.marca} <ChipOrderState state={order.estado} /></div>} subTitle={order.vehiculo.modelo} className='p-2 text-left border-round-2xl shadow' key={order.vehiculo.id} header={header}>
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
