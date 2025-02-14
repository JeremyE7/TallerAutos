'use client'

import { Calendar } from 'primereact/calendar'
import { useState } from 'react'
import { Nullable } from 'primereact/ts-helpers'


export default function Home () {
  const [date, setDate] = useState<Nullable<Date>>(null)
  return (
    <main className='w-full h-screen grid'>
      <section className='col-9'>
        <h2>Lista de Ordenes</h2>
      </section>
      <aside className='col-3'>
        <Calendar value={date} onChange={(e) => setDate(e.value)} inline className="h-27rem w-18rem" />
      </aside>

    </main>
  )
}
