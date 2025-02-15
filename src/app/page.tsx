'use client';

import { Calendar } from 'primereact/calendar';
import { useState } from 'react';
import { Nullable } from 'primereact/ts-helpers';
import styles from './page.module.css';
import Table from '@/components/table';
import { Button } from 'primereact/button';

export default function Home() {
  const [date, setDate] = useState<Nullable<Date>>(null);

  return (
    <main className={styles.container}>
      <section className={styles.section}>
        <h2>Lista de Órdenes</h2>
        <Table />
        <Button label="Nueva orden de trabajo" icon="pi pi-plus" className='mt-2' />
      </section>
      <aside className={styles.aside}>
        <h2>Calendario de entregas</h2>
        <Calendar
          value={date}
          onChange={(e) => setDate(e.value)}
          inline
          className={styles.calendar}
        />
      </aside>
    </main>
  );
}