'use client'
import { settingsStore } from '@/store/settingsStore'
import { Toast } from 'primereact/toast'
import { useEffect, useRef } from 'react'

export const ToastGeneral = () => {

  const { error, clearMessages, success } = settingsStore()

  const toastRef = useRef<Toast>(null)

  useEffect(() => {
    if (success) {
      toastRef.current?.show({ severity: 'success', summary: 'Success', detail: success, life: 3000 })
    }
  }, [success])


  useEffect(() => {
    if (error) {
      toastRef.current?.show({ severity: 'error', summary: 'Error', detail: error, life: 3000 })
    }
  }, [error])

  return (
    <Toast ref={toastRef} position='bottom-right' className='w-10 md:w-auto' onHide={clearMessages} onRemove={clearMessages} />
  )
}
