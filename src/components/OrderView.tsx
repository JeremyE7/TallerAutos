import { EstadosOrden, ModalProps, Option, OrdenTrabajo } from '@/app/types'
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
import { useEffect, useRef, useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast'
import { EditElementosIngreso } from './EditModals/EditElementosIngreso'
import { useOrders } from '@/hooks/useOrders'
import { EditClient } from './EditModals/EditClient'
import { useClients } from '@/hooks/useClients'
import { settingsStore } from '@/store/settingsStore'
import { EditVehicle } from './EditModals/EditVehicle'
import { useVehicle } from '@/hooks/useVehicle'

interface OrderViewProps {
  order: OrdenTrabajo | null,
  edit: boolean,
  editedOrder: OrdenTrabajo | null,
  setEditedOrder: (order: OrdenTrabajo) => void
}



export const OrderView: React.FC<OrderViewProps> = ({ order, edit, editedOrder, setEditedOrder }) => {

  const [orderExtraValuesToEdit, setOrderExtraValuesToEdit] = useState<ModalProps | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const {saveEditedClient} = useClients()
  const {error, clearError} = settingsStore()
  const toastRef = useRef<Toast>(null)
  let toastMessage = ''

  const { saveElementosIngreso } = useOrders()
  const { saveEditedVehicle } = useVehicle()

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
      code: EstadosOrden.PENDIENTE
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

  const handleChangeInput = (value: string, fieldKey: keyof OrdenTrabajo) => {
    if (editedOrder) {
      setEditedOrder({
        ...editedOrder,
        [fieldKey]: value
      })
    }
  }

  const FooterModal = () => {
    return (
      isLoading ? (
        <section className='flex justify-center pt-3 overflow-hidden'>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
        </section>
      ) : (
        <section className='flex justify-evenly pt-3'>
          <Button icon='pi pi-save' severity='warning' className='w-2' onClick={() => handleSaveEdit()} />
        </section>
      )
    )
  }

  const HeaderModal = () => {
    return (
      <div className='flex justify-center items-center flex-col md:flex-row gap-3'>
        {orderExtraValuesToEdit?.cliente && <h1 className='text-4xl text-primary font-bold'>Editar Cliente</h1>}
        {orderExtraValuesToEdit?.vehiculo && <h1 className='text-4xl text-primary font-bold'>Editar Vehiculo</h1>}
        {orderExtraValuesToEdit?.elementosIngreso && <h1 className='text-4xl text-primary font-bold'>Editar Elementos de ingreso</h1>}
        {orderExtraValuesToEdit?.fotos && <h1 className='text-4xl text-primary font-bold'>Editar Fotos</h1>}
      </div>
    )
  }


  const handleShowEditModal = (modal: ModalProps) => {
    setOrderExtraValuesToEdit(modal)
  }

  const hideModalEdit = () => {
    setOrderExtraValuesToEdit(null)
  }

  const handleSaveEdit = async () => {

    if (!orderExtraValuesToEdit || !editedOrder) return

    setIsLoading(true)
    let succesMessage = false

    if(orderExtraValuesToEdit.cliente){
      const updatedOrder = ({
        ...editedOrder,
        vehiculo: {
          ...editedOrder.vehiculo,
          cliente: orderExtraValuesToEdit.cliente
        }
      })
      setEditedOrder(updatedOrder)
      toastMessage = 'Cliente editado con exito'
      const succesEditedOrder = await saveEditedClient(updatedOrder.vehiculo.cliente)
      succesMessage = !!succesEditedOrder
    }

    if(orderExtraValuesToEdit.vehiculo){
      const updatedOrder = ({
        ...editedOrder,
        vehiculo: orderExtraValuesToEdit.vehiculo
      })
      setEditedOrder(updatedOrder)
      toastMessage = 'Vehiculo editado con exito'
      const succesEditedOrder = await saveEditedVehicle(updatedOrder.vehiculo)
      succesMessage = !!succesEditedOrder
    }

    if(orderExtraValuesToEdit.elementosIngreso){
      const updatedOrder = {
        ...editedOrder,
        elementosIngreso: orderExtraValuesToEdit.elementosIngreso
      }

      setEditedOrder(updatedOrder)

      toastMessage = 'Elementos de ingreso editados con éxito'

      const succesEditedOrder = await saveElementosIngreso(updatedOrder)
      succesMessage = !!succesEditedOrder
    }

    if(orderExtraValuesToEdit.fotos){
      setEditedOrder({
        ...editedOrder,
        foto: orderExtraValuesToEdit.fotos
      })
      toastMessage = 'Fotos editadas con exito'
    }

    if(succesMessage){
      toastRef.current?.show({ severity: 'success', summary: 'Acción completada', detail: toastMessage, life: 1000 })
      setOrderExtraValuesToEdit(null)
    }else{
      if (order) {
        setEditedOrder(order)
      }
    }

    setIsLoading(false)
    setOrderExtraValuesToEdit(null)
  }

  useEffect(() => {
    if(error){
      toastRef.current?.show({ severity: 'error', summary: 'Error', detail: error, life: 3000 })
    }
  },[error])


  if (!editedOrder) return <Loader widthPercentaje={50} heightPercentaje={50} />

  return (
    <>
      {
        orderExtraValuesToEdit && (
          <Dialog visible={orderExtraValuesToEdit != null}
            maximizable
            style={{ width: '80vw', maxHeight: '90vh' }}
            onHide={hideModalEdit}
            header={<HeaderModal/>}
            contentClassName='px-0'
            footer={<FooterModal />}
          >
            {orderExtraValuesToEdit.cliente && <EditClient orderToEdit={orderExtraValuesToEdit} setOrderToEdit={setOrderExtraValuesToEdit} />}
            {orderExtraValuesToEdit.vehiculo && <EditVehicle orderToEdit={orderExtraValuesToEdit} setOrderToEdit={setOrderExtraValuesToEdit} />}
            {orderExtraValuesToEdit.elementosIngreso && <EditElementosIngreso orderToEdit={orderExtraValuesToEdit} setOrderToEdit={setOrderExtraValuesToEdit} />}
            {orderExtraValuesToEdit.fotos && <h1>Fotos</h1>}
          </Dialog>
        )
      }
      <article>
        <section>
          <Divider align='left'><h2 className='text-left text-2xl'>Imagenes{edit && <Button icon='pi pi-pencil' className='ml-2' onClick={() => handleShowEditModal({ fotos: editedOrder.foto })} />}</h2></Divider>
          {editedOrder.foto ? (
            <GalleryyOrder orderPhotos={editedOrder.foto} />
          ) : (
            <p>No hay imagenes disponibles</p>
          )}
        </section>
        <section className=''>
          <Divider align='left'><h2 className='text-left text-2xl'>Cliente{edit && <Button icon='pi pi-pencil' className='ml-2' onClick={() => handleShowEditModal({ cliente: editedOrder.vehiculo.cliente })} />}</h2></Divider>
          <div className='label-show-container text-center'>
            <LabelShow label='Nombre' value={editedOrder.vehiculo.cliente.nombre} />
            <LabelShow label='Email' value={editedOrder.vehiculo.cliente.email} />
            <LabelShow label='CI/RUC' value={editedOrder.vehiculo.cliente.cedula} />
            <LabelShow label='Tel. Celular' value={editedOrder.vehiculo.cliente.telefono} />
            <LabelShow label='Dirección' value={editedOrder.vehiculo.cliente.direccion} />
            <LabelShow label='Fecha de Ingreso' value={editedOrder.fechaIngreso.toString()} />
          </div>
        </section>
        <section className='mt-4'>
          <Divider align='left'><h2 className='text-left text-2xl '>Automovil{edit && <Button icon='pi pi-pencil' className='ml-2' onClick={() => handleShowEditModal({ vehiculo: editedOrder.vehiculo })} />}</h2></Divider>
          <div className='label-show-container text-center'>
            <LabelShow label='Marca' value={editedOrder.vehiculo.marca} />
            <LabelShow label='Motor' value={editedOrder.vehiculo.motor} />
            <LabelShow label='Modelo' value={editedOrder.vehiculo.modelo} />
            <LabelShow label='Color' value={editedOrder.vehiculo.color} />
            <LabelShow label='Año' value={editedOrder.vehiculo.anio} />
            <LabelShow label='Placa' value={editedOrder.vehiculo.placa} />
            <LabelShow label='Chasis' value={editedOrder.vehiculo.chasis} />
            <LabelShow label='Km' value={editedOrder.vehiculo.kilometraje} />
          </div>
        </section>
        <section className='mt-4'>
          <Divider align='left'><h2 className='text-left text-2xl '>Elementos de ingreso{edit && <Button icon='pi pi-pencil' className='ml-2' onClick={() => handleShowEditModal({ elementosIngreso: editedOrder.elementosIngreso })} />}</h2></Divider>
          <div className='view-elementos-ingreso-container'>
            <ElementosIngresoView elements={editedOrder?.elementosIngreso} />
            <div className='nob-container'>
              <Knob value={editedOrder.elementosIngreso.combustible ?? 100} readOnly />
              <h2>Gasolina</h2>
            </div>
          </div>
        </section>
        <section className='mt-4'>
          <Divider align='left'><h2 className='text-left text-2xl'>Orden de Trabajo</h2></Divider>
          <div className='label-show-container text-center ml-0'>
            <TextAreaShow label='Operaciones solicitadas' value={editedOrder?.operaciones_solicitadas} order='column' editable={edit} onChange={(value: string) => handleChangeInput(value, 'operaciones_solicitadas')} />
          </div>
          {edit && <div className='mt-3 flex justify-center gap-1 flex-col w-5 m-auto'>
            <label htmlFor="">Estado:</label>
            <Dropdown value={editedOrder?.estado} onChange={(e) => handleChangeInput(e.value.code, 'estado')} options={optionsEditedState} optionLabel="name" className="flex justify-center h-10 w-12 m-auto md:w-6" valueTemplate={selectedFilterTemplate} placeholder='Escoge una opción' />
          </div>}
        </section>
        <section className='mt-4'>
          <Divider align='left'><h2 className='text-left text-2xl'>Forma de Pago</h2></Divider>
          <div className='flex justify-center gap-10 flex-col'>
            <FormaPago order={editedOrder} editable={edit} onChange={(value: string) => handleChangeInput(value, 'forma_pago')} />
            <div className='flex w-full justify-evenly flex-col md:flex-row'>
              <div className='label-show-container text-center m-0'>
                <LabelShow label='Total M/O' value={editedOrder?.total_mo} editable={edit} onChange={(value: string) => handleChangeInput(value, 'total_mo')} type='money' />
                <LabelShow label='Total REP' value={editedOrder?.total_rep} editable={edit} onChange={(value: string) => handleChangeInput(value, 'total_rep')} type='money' />
                <LabelShow label='IVA' value={editedOrder?.iva} editable={edit} onChange={(value: string) => handleChangeInput(value, 'iva')} type='money' />
                <LabelShow label='TOTAL' value={editedOrder?.total} />
              </div>
              <div className='text-area-show-container text-center mt-10 items-start md:mt-0'>
                <TextAreaShow label='Comentarios' value={editedOrder?.comentarios} order='column' editable={edit} onChange={(value: string) => handleChangeInput(value, 'comentarios')} />
              </div>
            </div>
          </div>
        </section>
      </article>
      <Toast ref={toastRef} position='bottom-right' className='w-10 md:w-auto' onHide={clearError} onRemove={clearError}/>
    </>

  )
}
