import React, { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { Checkbox } from 'primereact/checkbox'
import { AutoComplete } from 'primereact/autocomplete'
import { useClients } from '@/hooks/useClients'
import { useVehicle } from '@/hooks/useVehicle'
import { Cliente, EstadosOrden, Foto, MetodoPago, OrdenTrabajo, Vehiculo } from '@/app/types'
import { addLocale } from 'primereact/api'
import { Button } from 'primereact/button'
import { useOrders } from '@/hooks/useOrders'
import { InputTextarea } from 'primereact/inputtextarea'
import { UploaderImagesCreate } from './UploaderImagesCreate'
export default function OrdenTrabajoModal({ visible, onHide }) {
  const { saveFotos, saveEditedOrder } = useOrders()
  const { clients } = useClients()
  const { vehicles } = useVehicle()
  const { saveOrder } = useOrders() // Move useOrders hook here
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null) // Cliente seleccionado
  const [filteredClients, setFilteredClients] = useState<Cliente[]>([]) // Lista filtrada
  const [cedulaInput, setCedulaInput] = useState('') // Valor del input de cédula
  const [selectedVehicle, setSelectedVehicle] = useState<Vehiculo | null>(null) // Vehículo seleccionado
  const [filteredVehicles, setFilteredVehicles] = useState<Vehiculo[]>([]) // Lista filtrada de vehículos
  const [placaInput, setPlacaInput] = useState('') // Valor del input de placa
  const [tempFotos, setTempFotos] = useState<Omit<Foto, 'id'>>({
    frontal: undefined,
    trasera: undefined,
    derecha: undefined,
    izquierda: undefined,
    superior: undefined,
    interior: undefined
  })

  const handleUpload = async (newFotos: Omit<Foto, 'id'>) => {
    console.log('handleUpload', newFotos)

    setTempFotos(prev => ({ ...prev, ...newFotos }))
  }
  // Filtrar clientes según la cédula ingresada
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: unknown } }) => {
    if ('target' in e) { // Verifica si el evento tiene target (inputs y checkboxes)
      const { name, value, type, checked } = e.target as HTMLInputElement

      setOrder(prev => ({
        ...prev,
        vehiculo: {
          ...prev.vehiculo,
          [name]: type === 'checkbox' ? checked : value,
          cliente: {
            ...prev.vehiculo.cliente,
            [name]: type === 'checkbox' ? checked : value
          }
        },
        elementosIngreso: {
          ...prev.elementosIngreso,
          [name]: type === 'checkbox' ? checked : value
        }
      }))
    }
  }



  addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar'
  })
  const [order, setOrder] = useState<OrdenTrabajo>({
    id: 0,
    fechaIngreso: new Date(),
    fechaSalida: new Date(),
    operaciones_solicitadas: '',
    total_mo: 0,
    total_rep: 0,
    iva: 0,
    total: 0,
    comentarios: '',
    vehiculo: {
      id: 0,
      marca: '',
      modelo: '',
      anio: 0,
      chasis: '',
      motor: '',
      color: '',
      placa: '',
      kilometraje: 0,
      cliente: {
        id: 0,
        nombre: '',
        cedula: '',
        direccion: '',
        email: '',
        telefono: ''
      }
    },
    elementosIngreso: {
      id: 0,
      limpiaparabrisas: false,
      espejos: false,
      luces: false,
      placas: false,
      emblemas: false,
      radio: false,
      control_alarma: false,
      tapetes: false,
      aire_acondicionado: false,
      matricula: false,
      herramientas: false,
      tuerca_seguridad: false,
      gata: false,
      llave_ruedas: false,
      extintor: false,
      encendedor: false,
      antena: false,
      llanta_emergencia: false,
      combustible: 1
    },
    forma_pago: MetodoPago.EFECTIVO, // Inicializa con un valor predeterminado
    foto: {
      id: 0,
      frontal: '',
      trasera: '',
      derecha: '',
      izquierda: '',
      superior: '',
      interior: ''
    },
    estado: EstadosOrden.PENDIENTE
  })

  const dateChangeHandler = (e) => {
    console.log('Fecha de ingreso:', e)
    if (e.target.name === 'ingreso') {
      setOrder((prevOrder) => ({
        ...prevOrder,
        fechaIngreso: e.value // Actualizamos la fecha de ingreso
      }))
    } else if (e.target.name === 'salida') {
      setOrder((prevOrder) => ({
        ...prevOrder,
        fechaSalida: e.value // Actualizamos la fecha de salida
      }))
    }
  }


  const searchClients = (event) => {
    const query = event.query.toLowerCase()
    const results = clients.filter(client =>
      client.cedula.toLowerCase().includes(query)
    )
    setFilteredClients(results)
  }

  // Manejar selección de cliente
  const handleClientSelect = (e) => {
    const client = e.value // Objeto completo del cliente
    setSelectedClient(client) // Guardamos el cliente seleccionado
    setCedulaInput(client.cedula)
    setOrder((prevOrder) => ({
      ...prevOrder,
      vehiculo: {
        ...prevOrder.vehiculo,
        cliente: client // Actualizamos el cliente en el vehículo
      }
    }))
  }

  const handleCedulaChange = (e) => {
    setCedulaInput(e.value) // Actualizamos el valor del input de cédula
    if (e.value != selectedClient?.cedula) {
      setSelectedClient(null) // Limpiamos el cliente seleccionado
    }
    setFilteredClients([]) // Limpiamos la lista filtrada de clientes
    handleInputChange(e) // Actualizamos el valor del input de cédula en la orden
    console.log('Cliente seleccionado:', selectedClient)
  }

  // Manejar selección de vehículo
  const searchVehicles = (event) => {
    if (!selectedClient) {
      setFilteredVehicles([]) // Si no hay cliente seleccionado, no sugerir nada
      return
    }

    const query = event.query.toLowerCase()
    const results = vehicles.filter(vehicle =>
      vehicle.placa.toLowerCase().includes(query) &&
      vehicle.cliente.id === selectedClient.id // Asumiendo que usas `clienteId` para enlazar
    )

    setFilteredVehicles(results)
  }


  const handleVehicleSelect = (e) => {
    const vehicle = e.value // Objeto completo del vehículo
    setSelectedVehicle(vehicle) // Guardamos el vehículo seleccionado
    setOrder((prevOrder) => ({
      ...prevOrder,
      vehiculo: vehicle // Actualizamos el vehículo en la orden
    }))
  }

  const handleVehicleChange = (e) => {
    setPlacaInput(e.value) // Actualizamos el valor del input de placa
    setSelectedVehicle(null) // Limpiamos el vehículo seleccionado
    if (filteredVehicles.length == 1) {
      setSelectedVehicle(filteredVehicles[0]) // Si solo hay un vehículo, lo seleccionamos automáticamente
    }
    handleInputChange(e)
    console.log('Vehículo seleccionado:', selectedVehicle)
  }

  const categories = [
    { key: 'limpiaparabrisas', name: 'Limpiaparabrisas' },
    { key: 'espejos', name: 'Espejos' },
    { key: 'luces', name: 'Luces' },
    { key: 'placas', name: 'Placas' },
    { key: 'emblemas', name: 'Emblemas' },
    { key: 'radio', name: 'Radio' },
    { key: 'control_alarma', name: 'Control de Alarma' },
    { key: 'tapetes', name: 'Tapetes' },
    { key: 'aire_acondicionado', name: 'Aire Acondicionado' },
    { key: 'matricula', name: 'Matrícula' },
    { key: 'herramientas', name: 'Herramientas' },
    { key: 'tuerca_seguridad', name: 'Tuerca de Seguridad' },
    { key: 'gata', name: 'Gata' },
    { key: 'llave_ruedas', name: 'Llave de Ruedas' },
    { key: 'extintor', name: 'Extintor' },
    { key: 'encendedor', name: 'Encendedor' },
    { key: 'antena', name: 'Antena' },
    { key: 'llanta_emergencia', name: 'Llanta de Emergencia' }
  ]



  const handleSave = async () => {
    try {
      // 1. Crear la orden primero (con fotos vacías)
      const newOrder = await saveOrder(order)

      if (!newOrder || !newOrder.id || !newOrder.foto?.id) {
        throw new Error('No se pudo crear la orden')
      }

      // 2. Si hay fotos temporales, subirlas ahora que tenemos ID
      if (tempFotos) {
        console.log('Lastemp fotos son ', tempFotos)
        await saveFotos(newOrder.foto?.id, tempFotos)

        // Opcional: Actualizar el estado de la orden con las fotos subidas
        const updatedOrder = await saveEditedOrder(newOrder)
        if (updatedOrder) {
          setOrder(updatedOrder)
        } else {
          console.error('Updated order is undefined')
        }
      }

      console.info('Orden guardada con éxito:', newOrder)
      onHide()
    } catch (error) {
      console.error('Error al guardar la orden:', error)
      // Aquí podrías implementar lógica para eliminar la orden creada si falla la subida de fotos
    }
  }


  return (
    <Dialog header="Nueva Orden de Trabajo" visible={visible} style={{ width: '90vw' }} onHide={onHide} modal>
      <fieldset className="border rounded-lg p-3 mb-4 border-gray-400 text-left" >
        <legend className="font-bold px-2">Cliente</legend>
        <div className="grid grid-cols-3 gap-4 mt-1">
          <span className='p-float-label'>
            <AutoComplete
              value={selectedClient?.cedula || cedulaInput}
              suggestions={filteredClients}
              completeMethod={searchClients}
              field="cedula"
              onChange={handleCedulaChange}
              onSelect={handleClientSelect}
              name='cedula'
            />
            <label htmlFor="client">Cédula</label>
          </span>

          <span className='p-float-label'>
            <InputText
              value={selectedClient?.nombre || undefined}
              disabled={!!selectedClient}
              onChange={handleInputChange}
              name='nombre'
            />
            <label htmlFor="nombre">Nombre</label>
          </span>

          <span className='p-float-label'>
            <InputText
              value={selectedClient?.direccion || undefined}
              disabled={!!selectedClient}
              onChange={handleInputChange}
              name='direccion'
            />
            <label htmlFor="direccion">Dirección</label>
          </span>

          <span className='p-float-label'>
            <InputText
              value={selectedClient?.email || undefined}
              disabled={!!selectedClient}
              onChange={handleInputChange}
              name='email'
            />
            <label htmlFor="correo">Correo Electrónico</label>
          </span>

          <span className='p-float-label'>
            <InputText
              value={selectedClient?.telefono || undefined}
              disabled={!!selectedClient}
              onChange={handleInputChange}
              name='telefono'
            />
            <label htmlFor="telefono">Teléfono</label>
          </span>
        </div>
      </fieldset>

      <fieldset className="border rounded-lg p-3 mb-4 border-gray-400 text-left">
        <legend className="font-bold px-2">Vehículo</legend>
        <div className="grid grid-cols-3 gap-4 mt-1">
          <span className='p-float-label'>
            <AutoComplete
              value={selectedVehicle?.placa || placaInput}
              suggestions={filteredVehicles}
              completeMethod={searchVehicles}
              field="placa"
              onChange={handleVehicleChange}
              onSelect={handleVehicleSelect}
            />
            <label htmlFor="client">Placa</label>
          </span>

          <span className='p-float-label'>
            <InputText
              value={selectedVehicle?.marca || undefined}
              disabled={!!selectedVehicle}
              onChange={handleInputChange}
              name='marca'
            />
            <label htmlFor="client">Marca</label>
          </span>

          <span className='p-float-label'>
            <InputText
              value={selectedVehicle?.modelo || undefined}
              disabled={!!selectedVehicle}
              onChange={handleInputChange}
              name='modelo'
            />
            <label htmlFor="client">Modelo</label>
          </span>

          <span className='p-float-label'>
            <InputText type='number'
              value={selectedVehicle?.anio ? String(selectedVehicle.anio) : undefined}
              disabled={!!selectedVehicle}
              onChange={handleInputChange}
              name='anio'
            />
            <label htmlFor="client">Año</label>
          </span>

          <span className='p-float-label'>
            <InputText
              value={selectedVehicle?.chasis || undefined}
              disabled={!!selectedVehicle}
              onChange={handleInputChange}
              name='chasis'
            />
            <label htmlFor="client">Chasis</label>
          </span>

          <span className='p-float-label'>
            <InputText
              value={selectedVehicle?.motor || undefined}
              disabled={!!selectedVehicle}
              onChange={handleInputChange}
              name='motor'
            />
            <label htmlFor="client">Motor</label>
          </span>

          <span className='p-float-label'>
            <InputText
              value={selectedVehicle?.color || undefined}
              disabled={!!selectedVehicle}
              onChange={handleInputChange}
              name='color'
            />
            <label htmlFor="client">Color</label>
          </span>



          <span className='p-float-label'>
            <InputText
              type='number'
              value={selectedVehicle ? String(selectedVehicle.kilometraje) : String(order.vehiculo.kilometraje || '')}
              disabled={!!selectedVehicle}
              onChange={handleInputChange}
              name="kilometraje"
            />
            <label htmlFor="kilometraje">Kilometraje</label>
          </span>


          <span className='p-float-label'>
            <InputText
              type='number'
              onChange={handleInputChange}
              name='combustible'
            />
            <label htmlFor="client">Combustible</label>
          </span>

        </div>
        <div className="!grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 w-full items-center">
          {categories.map((category) => (
            <div key={category.key} className="flex items-center">
              <Checkbox
                inputId={category.key}
                name={category.key}
                checked={!!order.elementosIngreso[category.key]}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor={category.key} className="whitespace-nowrap">
                {category.name}
              </label>
            </div>
          ))}
        </div>



      </fieldset>
      <fieldset className='border rounded-lg p-3 mb-4 border-gray-400 text-left'>
        <legend className='font-bold px-2'>Fotos del vehículo</legend>
        {/* Otros campos del formulario */}
        <UploaderImagesCreate
          onUpload={handleUpload}
          initialFotos={tempFotos}
        />
      </fieldset>
      <fieldset className='border rounded-lg p-3 mb-4 border-gray-400 text-left'>
        <legend className="font-bold px-2">Datos de Orden de Trabajo</legend>
        <div className="!grid grid-cols-2 gap-4 mt-1">
          <span className='flex-auto'>
            <label htmlFor="buttondisplay" className="block mb-2">
              Fecha de ingreso
            </label>
            <Calendar name='ingreso' showTime hourFormat='12' touchUI className='w-full' locale='es' onChange={dateChangeHandler} value={order.fechaIngreso} />
          </span>

          <span className='flex-auto'>
            <label htmlFor="buttondisplay" className="block mb-2">
              Fecha de salida
            </label>
            <Calendar name='salida' showTime hourFormat='12' touchUI className='w-full' locale='es' onChange={dateChangeHandler} value={order.fechaSalida} />
          </span>

          <span className='p-float-label col-span-2'>
            <InputTextarea className='w-full h-fit' name='operaciones_solicitadas' onChange={handleInputChange} />
            <label htmlFor="client">Operaciones Solicitadas</label>
          </span>
          <label htmlFor="client" className='col-span-2'><b>PAGO</b></label>

          <Dropdown
            placeholder="Selecciona el método de pago"
            className='w-full'
            options={Object.values(MetodoPago).map(value => ({ label: value, value }))}
            onChange={(e) => setOrder({ ...order, forma_pago: e.value })}
            name='forma_pago'
            value={order.forma_pago} // Asegúrate de que el valor esté en el estado de la orden
          />



          <span className='p-float-label'>
            <InputText className='w-full' onChange={handleInputChange} name='total_mo' />
            <label htmlFor="client">Abono</label>
          </span>

          <span className='p-float-label'>
            <InputText className='w-full' onChange={handleInputChange} name='total_rep' />
            <label htmlFor="client">Saldo</label>
          </span>

          <span className='p-float-label'>
            <InputText className='w-full' onChange={handleInputChange} name='total' />
            <label htmlFor="client">Total</label>
          </span>

        </div>
      </fieldset>
      <div className="flex justify-end mt-4">
        <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={onHide} />
        <Button label="Guardar" icon="pi pi-check" className="p-button-success" onClick={handleSave} />
      </div>
    </Dialog>
  )
}
