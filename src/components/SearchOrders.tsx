import { Option, OrdenTrabajo } from '@/app/types'
import { useOrders } from '@/hooks/useOrders'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { DropdownProps } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { OverlayPanel } from 'primereact/overlaypanel'
import { useEffect, useRef, useState } from 'react'

const options: Option[] = [
  {
    name: 'Cliente',
    icon: 'pi pi-user',
    code: 'client'
  },
  {
    name: 'Vehículo',
    icon: 'pi pi-car',
    code: 'vehicle'
  },
  {
    name: 'Estado',
    icon: 'pi pi-check',
    code: 'state'
  }
]


const filterMappings: Record<string, Record<string, (order: OrdenTrabajo, value: string) => boolean>> = {
  client: {
    name: (order, value) => {
      return order.vehiculo.cliente.nombre.includes(value)
    },
    phone: (order, value) => order.vehiculo.cliente.telefono?.includes(value) ?? false,
    email: (order, value) => order.vehiculo.cliente.email?.includes(value) ?? false,
    id: (order, value) => order.vehiculo.cliente.cedula.includes(value)
  },
  vehicle: {
    plate: (order, value) => order.vehiculo.placa.includes(value),
    brand: (order, value) => order.vehiculo.marca.includes(value)
  },
  state: {
    inProcess: (order) => {
      return order.estado === 'En proceso'
    },
    finished: (order) => order.estado === 'Finalizada',
    pending: (order) => order.estado === 'Pendiente',
    canceled: (order) => order.estado === 'Cancelada'
  }
}

export const SearchOrders = () => {

  const [selectedFilter, setSelectedFilter] = useState<Option | null>()
  const [selectedAttribute, setSelectedAttribute] = useState<Option | null>(null)
  const [attributeOptions, setAttributeOptions] = useState<Option[]>([])
  const [value, setValue] = useState('')
  const { setFilteredOrders, orders, filteredOrders } = useOrders()
  const op = useRef<OverlayPanel>(null)


  useEffect(() => {
    setSelectedFilter(options[0])
  }, [])

  useEffect(() => {
    if (selectedFilter) {
      switch (selectedFilter.code) {
      case 'client':
        const clientOptions: Option[] = [
          {
            name: 'Nombre',
            icon: 'pi pi-user',
            code: 'name'
          },
          {
            name: 'Teléfono',
            icon: 'pi pi-phone',
            code: 'phone'
          },
          {
            name: 'Email',
            icon: 'pi pi-envelope',
            code: 'email'
          },
          {
            name: 'Identificación',
            icon: 'pi pi-id-card',
            code: 'id'
          }
        ]

        setAttributeOptions(clientOptions)
        setSelectedAttribute(clientOptions[0])
        break
      case 'vehicle':
        const vehicleOptions: Option[] = [
          {
            name: 'Placa',
            icon: 'pi pi-car',
            code: 'plate'
          },
          {
            name: 'Marca',
            icon: 'pi pi-tag',
            code: 'brand'
          }
        ]

        setAttributeOptions(vehicleOptions)
        setSelectedAttribute(vehicleOptions[0])
        break
      case 'state':
        const stateOptions: Option[] = [
          {
            name: 'En proceso',
            icon: 'pi pi-spinner',
            code: 'inProcess'
          },
          {
            name: 'Finalizada',
            icon: 'pi pi-check',
            code: 'finished'
          },
          {
            name: 'Pendiente',
            icon: 'pi pi-exclamation-triangle',
            code: 'pending'
          },
          {
            name: 'Cancelada',
            icon: 'pi pi-times',
            code: 'canceled'
          }
        ]
        setAttributeOptions(stateOptions)
        setSelectedAttribute(stateOptions[0])
        break
      }
    }
  }, [selectedFilter])

  const selectedFilterTemplate = (option: Option | null, props: DropdownProps) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <i className={option.icon}></i>
          <div className='ml-2'>{option.name}</div>
        </div>
      )
    }

    return <span>{props.placeholder}</span>
  }

  const handleChangeFilter = (e: { value: Option }) => {
    setSelectedFilter(e.value)
    handleRestart()
  }

  const itemFilterTemplate = (option: Option) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <i className={option.icon}></i>
          <div className='ml-2'>{option.name}</div>
        </div>
      )
    }
  }

  const handleClick = () => {
    if(op.current?.toggle){
      op.current.hide()
    }

    if (value.trim() === '' && selectedFilter?.code !== 'state') {
      setFilteredOrders(orders)
      return
    }

    const filterFunction = selectedFilter && selectedAttribute ? filterMappings[selectedFilter.code]?.[selectedAttribute.code] : undefined

    const filteredOrders = orders.filter((order) => filterFunction ? filterFunction(order, value) : true)
    setFilteredOrders(filteredOrders)
  }

  const handleRestart = () => {
    setFilteredOrders(orders)
    setValue('')
  }


  return (
    <>
      <div className='filter-container hidden md:grid!' style={{ gridTemplateAreas: selectedFilter?.code === 'state' ? '"filter attribute button restart"' : '"filter attribute value button restart"' }}>
        <section className='filter'>
          <h2>Buscar por:</h2>
          <Dropdown value={selectedFilter} onChange={handleChangeFilter} options={options} optionLabel="name" placeholder="Escoge una opcion"
            valueTemplate={selectedFilterTemplate} itemTemplate={itemFilterTemplate} className="w-full md:w-10rem p-inputtext-sm"
          />
        </section>
        <section className='attribute'>
          <h2>Atributo:</h2>
          <Dropdown value={selectedAttribute} onChange={(e) => setSelectedAttribute(e.value)} options={attributeOptions} optionLabel="name" placeholder="Escoge una opcion"
            valueTemplate={selectedFilterTemplate} itemTemplate={itemFilterTemplate} className="w-full md:w-10rem p-inputtext-sm"
          />
        </section>
        <section className='value' style={{ display: selectedFilter?.code === 'state' ? 'none' : 'block' }}>
          <h2>Valor:</h2>
          <InputText value={value} onChange={(e) => setValue(e.target.value)} className='p-inputtext-sm w-full md:w-10rem m-0' />
        </section>

        <section className='search'>
          <Button icon="pi pi-search" className='p-button-rounded p-button-primary shadow' onClick={handleClick} />
        </section>
        <section className='restart' >
          <Button icon="pi pi-refresh" className='p-button-rounded p-button-primary' onClick={handleRestart} disabled={orders === filteredOrders}/>
        </section>
      </div>
      <div className="card justify-content-center flex md:hidden">
        <Button type="button" icon="pi pi-search" onClick={(e) => op.current && op.current.toggle(e)} />
        <OverlayPanel ref={op}>
          <div className="flex flex-col gap-2 min-w-50">
            <div className="">
              <Dropdown value={selectedFilter} onChange={handleChangeFilter} options={options} optionLabel="name" placeholder="Escoge una opcion"
                valueTemplate={selectedFilterTemplate} itemTemplate={itemFilterTemplate} className="w-full p-inputtext-sm"
              />
            </div>
            <div className="">
              <Dropdown value={selectedAttribute} onChange={(e) => setSelectedAttribute(e.value)} options={attributeOptions} optionLabel="name" placeholder="Escoge una opcion"
                valueTemplate={selectedFilterTemplate} itemTemplate={itemFilterTemplate} className="w-full p-inputtext-sm"
              />
            </div>
            <div className="" style={{ display: selectedFilter?.code === 'state' ? 'none' : 'block' }}>
              <InputText value={value} onChange={(e) => setValue(e.target.value)} className='p-inputtext-sm w-full' />
            </div>
            <div className="flex gap-2 justify-center mt-2">
              <Button icon="pi pi-search" className='p-button-rounded p-button-primary shadow' onClick={handleClick} />
              <Button icon="pi pi-refresh" className='p-button-rounded p-button-primary' onClick={handleRestart} disabled={orders === filteredOrders}/>
            </div>
          </div>
        </OverlayPanel>
      </div>
    </>
  )
}

