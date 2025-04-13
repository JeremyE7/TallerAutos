'use client'
import { Loader } from '@/components/Loader/Loader'
import { useOrders } from '@/hooks/useOrders'
import { Calendar, CalendarDateTemplateEvent } from 'primereact/calendar'
import { Nullable } from 'primereact/ts-helpers'
import { useEffect, useState } from 'react'
import { OrdenTrabajo } from '../types'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { DialogOrder } from '@/components/OrderView/DialogOrder'

export default function Calendary () {

  const [date, setDate] = useState<Nullable<Date>>()
  const [isLoading, setIsLoading] = useState(true)
  const [dueDates, setDueDates] = useState<OrdenTrabajo[]>()
  const [ordersToShow, setOrdersToShow] = useState<OrdenTrabajo[]>()
  const [visible, setVisible] = useState(false)
  const [orderToShowInModal, setOrderToShowInModal] = useState<OrdenTrabajo | null>(null)
  const [editedOrder, setEditedOrder] = useState<OrdenTrabajo | null>(orderToShowInModal)

  const { orders } = useOrders()

  useEffect(() => {
    if (!orders) return
    setIsLoading(false)
    const dueDatesAux = orders.map(order => ({
      ...order, fechaSalida: new Date(order.fechaSalida)
    }))
    const today = new Date()

    const nextDueDates = dueDatesAux.filter((date) => {
      if (date.fechaSalida > today) {
        return date
      }
    })
    setDueDates(nextDueDates)
  }, [orders])

  useEffect(() => {
    setOrdersToShow(dueDates)
  }, [dueDates])

  const dateTemplate = (e: CalendarDateTemplateEvent) => {

    if (!dueDates) return

    const formatedDate = (e.day).toString().padStart(2, '0') + '/' + (e.month + 1).toString().padStart(2, '0') + '/' + (e.year).toString().padStart(2, '0')

    const handleClick = () => {
      const newOrdersToShow = dueDates.filter((date) => {
        return date.fechaSalida.toLocaleDateString('en-GB') === formatedDate
      })
      setOrdersToShow(newOrdersToShow)
    }

    const duesAvailableToThisDate = dueDates.filter((date) => {
      return date.fechaSalida.toLocaleDateString('en-GB') === formatedDate
    }).length

    return (
      <div className='flex flex-col items-center' onClick={handleClick}>
        <h1>
          {e.day}
        </h1>
        <span className={('size-2 rounded-full ') + (duesAvailableToThisDate === 0 ? 'hidden' :
          duesAvailableToThisDate < 2 ? 'bg-yellow-400' : duesAvailableToThisDate < 4 ? 'bg-orange-400' : 'bg-red-400')
        }></span>
      </div>
    )
  }

  const showModal = (order: OrdenTrabajo) => {
    if (visible) return
    setOrderToShowInModal(order)
    setEditedOrder(order)
    setVisible(true)
  }

  const hideModal = () => {
    if (!visible) return
    setVisible(false)
    setOrderToShowInModal(null)
  }



  return (
    <>
      <DialogOrder editedOrder={editedOrder} onHide={hideModal} orderToShowInModal={orderToShowInModal} setEditedOrder={setEditedOrder} visible={visible} />
      <section className='flex md:justify-center items-center w-full gap-6 flex-col md:flex-row mt-5 '>
        {
          isLoading ? <Loader widthPercentaje={10} heightPercentaje={10} /> : (
            <>
              <Calendar value={date} onChange={(e) => setDate(e.value)} inline showWeek dateTemplate={dateTemplate} className='h-[477px]' />
              <div className='flex flex-col h-[430px]'>
                <h2 className='text-yellow-400 mb-4 flex  justify-center items-center gap-5'>
                  Fechas de Entrega
                  {dueDates !== ordersToShow && <Button icon={'pi pi-filter-slash'} severity='warning' onClick={() => {
                    setOrdersToShow(dueDates)
                    setDate(null)
                  }}/>}
                </h2>
                <ul className='flex flex-col w-80 gap-4'>
                  {ordersToShow && ordersToShow.length > 0 ? ordersToShow.map((date, index) => (
                    <li key={index} className='flex flex-row w-full gap-10 items-center justify-between'>
                      <h3 className='w-28'>{date.vehiculo.cliente.nombre}</h3>
                      <Tag severity={'info'} value={date.fechaSalida.toLocaleDateString('en-GB')} />
                      <Button icon={'pi pi-book'} severity='success' onClick={() => showModal(date)} />
                    </li>
                  )) : <div className='h-80'>
                    <h3>No hay ordenes pendientes de entregar</h3>
                  </div>}
                </ul>
              </div>

            </>
          )
        }
      </section>
    </>
  )


}
