import { EstadosOrden, Option, OrdenTrabajo } from '@/app/types'
import { Loader } from './Loader/Loader'
import { Divider } from 'primereact/divider'
import GalleryyOrder from './GalleryOrder'
import { LabelShow } from './LabelShow'
import { ElementosIngresoView } from './ElementosIngresoView'
import { Knob } from 'primereact/knob'
import { FormaPago } from './FormaPago'
import { TextAreaShow } from './TextAreaShow'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'

interface OrderViewProps {
  order: OrdenTrabajo | null,
  edit: boolean,
  editedOrder: OrdenTrabajo | null,
  setEditedOrder: (order: OrdenTrabajo) => void
}
export const OrderView: React.FC<OrderViewProps> = ({ order, edit, editedOrder, setEditedOrder }) => {


  const optionsEditedState: Option[] = [
    {
      name: 'En proceso',
      icon: 'pi pi-spinner',
      code: EstadosOrden.EN_PROCESO
    },
    {
      name: 'Finalizada',
      icon: 'pi pi-check',
      code: EstadosOrden.FINALIZADA
    },
    {
      name: 'Pendiente',
      icon: 'pi pi-exclamation-triangle',
      code:  EstadosOrden.PENDIENTE
    },
    {
      name: 'Cancelada',
      icon: 'pi pi-times',
      code: EstadosOrden.CANCELADA
    }
  ]

  const selectedFilterTemplate = (option: Option | null) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div className='ml-2'>{option.name}</div>
        </div>
      )
    }

    return <div className="flex align-items-center">
      <div className='ml-2'>{editedOrder?.estado}</div>
    </div>
  }

  const handleChangeInput = (value: string, fieldKey: keyof OrdenTrabajo ) => {
    if (editedOrder) {
      setEditedOrder({
        ...editedOrder,
        [fieldKey]: value
      })
    }
  }


  if (!order) return <Loader widthPercentaje={50} heightPercentaje={50} />

  return (
    <article>
      <section>
        <Divider align='left'><h2 className='text-left text-2xl'>Imagenes{edit && <Button icon='pi pi-pencil' className='ml-2'/>}</h2></Divider>
        {order.foto ? (
          <GalleryyOrder orderPhotos={order.foto}/>
        ): (
          <p>No hay imagenes disponibles</p>
        )}
      </section>
      <section className=''>
        <Divider align='left'><h2 className='text-left text-2xl'>Cliente{edit && <Button icon='pi pi-pencil' className='ml-2'/>}</h2></Divider>
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
        <Divider align='left'><h2 className='text-left text-2xl '>Automovil{edit && <Button icon='pi pi-pencil' className='ml-2'/>}</h2></Divider>
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
        <Divider align='left'><h2 className='text-left text-2xl '>Elementos de ingreso{edit && <Button icon='pi pi-pencil' className='ml-2'/>}</h2></Divider>
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
          <TextAreaShow label='Operaciones solicitadas' value={editedOrder?.operaciones_solicitadas} order='column' editable={edit} onChange={(value: string) => handleChangeInput(value, 'operaciones_solicitadas')}/>
        </div>
        {edit && <div className='mt-3 flex justify-center gap-1 flex-col w-5 m-auto'>
          <label htmlFor="">Estado:</label>
          <Dropdown value={editedOrder?.estado} onChange={(e) => handleChangeInput(e.value.code, 'estado')} options={optionsEditedState} optionLabel="name" className="flex justify-center h-10 w-12 m-auto md:w-6" valueTemplate={selectedFilterTemplate} placeholder='Escoge una opción'/>
        </div>}
      </section>
      <section className='mt-4'>
        <Divider align='left'><h2 className='text-left text-2xl'>Forma de Pago</h2></Divider>
        <div className='flex justify-center gap-10 flex-col'>
          <FormaPago order={editedOrder} editable={edit} onChange={(value: string) => handleChangeInput(value, 'forma_pago')}/>
          <div className='flex w-full justify-evenly flex-col md:flex-row'>
            <div className='label-show-container text-center m-0'>
              <LabelShow label='Total M/O' value={editedOrder?.total_mo} editable={edit} onChange={(value: string) => handleChangeInput(value, 'total_mo')} type='money'/>
              <LabelShow label='Total REP' value={editedOrder?.total_rep} editable={edit} onChange={(value: string) => handleChangeInput(value, 'total_rep')} type='money'/>
              <LabelShow label='IVA' value={editedOrder?.iva} editable={edit} onChange={(value: string) => handleChangeInput(value, 'iva')} type='money'/>
              <LabelShow label='TOTAL' value={editedOrder?.total} />
            </div>
            <div className='text-area-show-container text-center mt-10 items-start md:mt-0'>
              <TextAreaShow label='Comentarios' value={editedOrder?.comentarios} order='column' editable={edit} onChange={(value: string) => handleChangeInput(value, 'comentarios')} />
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
