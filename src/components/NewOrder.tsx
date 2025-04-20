import React, { useCallback, useState } from 'react'
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

// Configuración de localización (mejor fuera del componente)
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

// Estado inicial (mejor fuera del componente)
const initialOrderState: OrdenTrabajo = {
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
  forma_pago: MetodoPago.EFECTIVO,
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
}

const initialFotoState: Omit<Foto, 'id'> = {
  frontal: undefined,
  trasera: undefined,
  derecha: undefined,
  izquierda: undefined,
  superior: undefined,
  interior: undefined
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

export default function OrdenTrabajoModal({ visible, onHide }) {
  // Hooks
  const { saveFotos, saveEditedOrder, saveOrder } = useOrders()
  const { clients } = useClients()
  const { vehicles } = useVehicle()

  // Estados
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null)
  const [filteredClients, setFilteredClients] = useState<Cliente[]>([])
  const [cedulaInput, setCedulaInput] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState<Vehiculo | null>(null)
  const [filteredVehicles, setFilteredVehicles] = useState<Vehiculo[]>([])
  const [placaInput, setPlacaInput] = useState('')
  const [tempFotos, setTempFotos] = useState<Omit<Foto, 'id'>>(initialFotoState)
  const [order, setOrder] = useState<OrdenTrabajo>(initialOrderState)

  // Handlers optimizados con useCallback
  const handleUpload = useCallback(async (newFotos: Omit<Foto, 'id'>) => {
    setTempFotos(prev => ({ ...prev, ...newFotos }))
    console.log('Fotos subidas:', tempFotos)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: unknown } }) => {
    if ('target' in e) {
      const { name, value, type, checked } = e.target as HTMLInputElement

      setOrder(prev => {
        // Create a copy of the previous state
        const newState = { ...prev }

        // Handle fields that belong to vehiculo.cliente
        if (['nombre', 'direccion', 'email', 'telefono', 'cedula'].includes(name)) {
          newState.vehiculo = {
            ...prev.vehiculo,
            cliente: {
              ...prev.vehiculo.cliente,
              [name]: value
            }
          }
        }
        // Handle fields that belong to vehiculo
        else if (['placa', 'marca', 'modelo', 'anio', 'chasis', 'motor', 'color', 'kilometraje', 'combustible'].includes(name)) {
          newState.vehiculo = {
            ...prev.vehiculo,
            [name]: value
          }
        }
        // Handle checkbox fields that belong to elementosIngreso
        else if (categories.some(cat => cat.key === name)) {
          newState.elementosIngreso = {
            ...prev.elementosIngreso,
            [name]: type === 'checkbox' ? checked : value
          }
        }
        // Handle other top-level fields
        else {
          newState[name] = value
        }

        return newState
      })
    }
  }, [categories])

  const dateChangeHandler = useCallback((e) => {
    const field = e.target.name
    const newDate = e.value

    setOrder(prev => ({
      ...prev,
      [field === 'ingreso' ? 'fechaIngreso' : 'fechaSalida']: newDate
    }))
  }, [])

  const searchClients = useCallback((event) => {
    const query = event.query.toLowerCase()
    setFilteredClients(clients.filter(client => client.cedula.toLowerCase().includes(query)))
  }, [clients])

  const handleClientSelect = useCallback((e) => {
    const client = e.value
    setSelectedClient(client)
    setCedulaInput(client.cedula)
  }, [])

  const handleCedulaChange = useCallback((e) => {
    setCedulaInput(e.value)
    if (e.value !== selectedClient?.cedula) {
      setSelectedClient(null)
    }
    setFilteredClients([])
    handleInputChange(e)
    setSelectedVehicle(null)
    setPlacaInput('')
    setFilteredVehicles([])

    setOrder(prev => ({
      ...prev,
      vehiculo: {
        ...initialOrderState.vehiculo,
        cliente: { ...initialOrderState.vehiculo.cliente }
      }
    }))
  }, [selectedClient, handleInputChange])

  const searchVehicles = useCallback((event) => {
    if (!selectedClient) {
      setFilteredVehicles([])
      return
    }

    const query = event.query.toLowerCase()
    const results = vehicles.filter(vehicle =>
      vehicle.placa.toLowerCase().includes(query) &&
      vehicle.cliente.id === selectedClient.id
    )
    setFilteredVehicles(results)
  }, [selectedClient, vehicles])

  const handleVehicleSelect = useCallback((e) => {
    const vehicle = e.value
    setSelectedVehicle(vehicle)
    setOrder(prev => ({ ...prev, vehiculo: vehicle }))
  }, [])

  const handleVehicleChange = useCallback((e) => {
    setPlacaInput(e.value)
    setSelectedVehicle(null)
    handleInputChange(e)
  }, [handleInputChange])

  const handleSave = useCallback(async () => {
    try {
      const newOrder = await saveOrder(order)
      if (!newOrder) {
        console.error('Error al guardar la orden', newOrder, order)
        return
      }
      onHide()
    } catch (error) {
      console.error('Error al guardar la orden:', error)
    }
  }, [order, tempFotos, saveOrder, saveFotos, saveEditedOrder, onHide])


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
              value={selectedClient?.nombre || order.vehiculo.cliente.nombre}
              disabled={!!selectedClient}
              onChange={handleInputChange}
              name='nombre'
            />
            <label htmlFor="nombre">Nombre</label>
          </span>

          <span className='p-float-label'>
            <InputText
              value={selectedClient?.direccion || order.vehiculo.cliente.direccion}
              disabled={!!selectedClient}
              onChange={handleInputChange}
              name='direccion'
            />
            <label htmlFor="direccion">Dirección</label>
          </span>

          <span className='p-float-label'>
            <InputText
              value={selectedClient?.email || order.vehiculo.cliente.email}
              disabled={!!selectedClient}
              onChange={handleInputChange}
              name='email'
            />
            <label htmlFor="correo">Correo Electrónico</label>
          </span>

          <span className='p-float-label'>
            <InputText
              value={selectedClient?.telefono || order.vehiculo.cliente.telefono}
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
              value={selectedVehicle?.placa || order.vehiculo.placa || placaInput}
              suggestions={filteredVehicles}
              completeMethod={searchVehicles}
              field="placa"
              name="placa"
              onChange={handleVehicleChange}
              onSelect={handleVehicleSelect}
            />
            <label htmlFor="client">Placa</label>
          </span>

          <span className='p-float-label'>
            <InputText
              value={selectedVehicle?.marca || order.vehiculo.marca}
              disabled={!!selectedVehicle}
              onChange={handleInputChange}
              name='marca'
            />
            <label htmlFor="client">Marca</label>
          </span>

          <span className='p-float-label'>
            <InputText
              value={selectedVehicle?.modelo || order.vehiculo.modelo}
              disabled={!!selectedVehicle}
              onChange={handleInputChange}
              name='modelo'
            />
            <label htmlFor="client">Modelo</label>
          </span>

          <span className='p-float-label'>
            <InputText type='number'
              value={selectedVehicle?.anio ? String(selectedVehicle.anio) : String(order.vehiculo.anio)}
              disabled={!!selectedVehicle}
              onChange={handleInputChange}
              name='anio'
            />
            <label htmlFor="client">Año</label>
          </span>

          <span className='p-float-label'>
            <InputText
              value={selectedVehicle?.chasis || order.vehiculo.chasis}
              disabled={!!selectedVehicle}
              onChange={handleInputChange}
              name='chasis'
            />
            <label htmlFor="client">Chasis</label>
          </span>

          <span className='p-float-label'>
            <InputText
              value={selectedVehicle?.motor || order.vehiculo.motor}
              disabled={!!selectedVehicle}
              onChange={handleInputChange}
              name='motor'
            />
            <label htmlFor="client">Motor</label>
          </span>

          <span className='p-float-label'>
            <InputText
              value={selectedVehicle?.color || order.vehiculo.color}
              disabled={!!selectedVehicle}
              onChange={handleInputChange}
              name='color'
            />
            <label htmlFor="client">Color</label>
          </span>



          <span className='p-float-label'>
            <InputText
              type='number'
              value={selectedVehicle?.kilometraje ? String(selectedVehicle.kilometraje) : String(order.vehiculo.kilometraje)}
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

          <span className='p-float-label col-span-2'>
            <InputTextarea className='w-full h-fit' name='comentarios' onChange={handleInputChange} />
            <label htmlFor="client">Comentarios</label>
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
