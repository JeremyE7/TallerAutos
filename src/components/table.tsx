
import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
export default function Table () {
  const handleEdit = (rowData: any) => {
    console.log('Editar:', rowData)
  }

  const handlePrint = (rowData: any) => {
    console.log('Imprimir:', rowData)
  }

  const handleView = (rowData: any) => {
    console.log('Ver:', rowData)
  }

  const actionsTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-file-edit"
          className="p-button-rounded p-button-text"
          onClick={() => handleEdit(rowData)}
          tooltip="Editar"
          tooltipOptions={{ position: 'top' }}
        />
        <Button
          icon="pi pi-print"
          className="p-button-rounded p-button-text"
          onClick={() => handlePrint(rowData)}
          tooltip="Imprimir"
          tooltipOptions={{ position: 'top' }}
        />
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-text"
          onClick={() => handleView(rowData)}
          tooltip="Ver"
          tooltipOptions={{ position: 'top' }}
        />
      </div>
    )
  }
  const orders = [
    {
      client: 'Juan Pérez',
      registerDate: '2023-10-01',
      deliverDate: '2023-10-10'
    },
    {
      client: 'María Gómez',
      registerDate: '2023-10-02',
      deliverDate: '2023-10-11'
    },
    {
      client: 'Carlos López',
      registerDate: '2023-10-03',
      deliverDate: '2023-10-12'
    },
    {
      client: 'Ana Martínez',
      registerDate: '2023-10-04',
      deliverDate: '2023-10-13'
    },
    {
      client: 'Luis Rodríguez',
      registerDate: '2023-10-05',
      deliverDate: '2023-10-14'
    }
  ]
  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <DataTable value={orders} tableStyle={{ minWidth: 'auto' }}>
        <Column field="client" header="Cliente"></Column>
        <Column field="registerDate" header="Fecha de registro"></Column>
        <Column field="deliverDate" header="Fecha de entrega"></Column>
        <Column
          body={actionsTemplate}
          header="Acciones"
          style={{ width: '150px' }}
        ></Column>
      </DataTable>
    </div>
  )
}
