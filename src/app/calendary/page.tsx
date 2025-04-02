'use client'
import { Loader } from '@/components/Loader/Loader'
import { useOrders } from '@/hooks/useOrders'
import { Calendar, CalendarDateTemplateEvent } from 'primereact/calendar'
import { Nullable } from 'primereact/ts-helpers'
import { useEffect, useState } from 'react'
import { OrdenTrabajo } from '../types'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'

export default function Calendary () {

  const [date, setDate] = useState<Nullable<Date>>()
  const { orders } = useOrders()
  const [isLoading, setIsLoading] = useState(true)
  const [dueDates, setDueDates] = useState<OrdenTrabajo[]>()

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

  const dateTemplate = (e: CalendarDateTemplateEvent) => {

    if (!dueDates) return

    const formatedDate = (e.day).toString().padStart(2, '0') + '/' + (e.month + 1).toString().padStart(2, '0') + '/' + (e.year).toString().padStart(2, '0')

    return (
      <div className='flex flex-col items-center'>
        <h1>
          {e.day}
        </h1>
        {dueDates && dueDates.map((date, index) => {
          if (date.fechaSalida.toLocaleDateString('en-GB') === formatedDate) return (
            <span key={index} className='size-2 bg-yellow-400 rounded-full'></span>
          )
        }
        )}
      </div>
    )
  }

  return (
    <section className='h-full flex justify-center items-center w-full gap-6'>
      {
        isLoading ? <Loader widthPercentaje={10} heightPercentaje={10} /> : (
          <>
            <Calendar value={date} onChange={(e) => setDate(e.value)} inline showWeek dateTemplate={dateTemplate} />
            <ul className='flex flex-col w-80'>
              <h2 className='text-yellow-400 mb-2'>Fechas de Entrega</h2>
              {dueDates && dueDates.length > 0 ? dueDates.map((date, index) => (
                <li key={index} className='flex flex-row w-full gap-10 items-center'>
                  <h3>{date.vehiculo.cliente.nombre}</h3>
                  <Tag severity={'info'} value={date.fechaSalida.toLocaleDateString('en-GB')} />
                  <Button icon={'pi pi-book'} severity='success' />
                </li>
              )) : <h3>No hay ordenes pendientes de entregar</h3>}
            </ul>

          </>
        )
      }
    </section>
  )


}
