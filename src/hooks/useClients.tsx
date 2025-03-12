import { Cliente } from '@/app/types'
import { getClients } from '@/utils/client'
import { useEffect, useState } from 'react'

export const useClients = () => {
  const [clients, setClients] = useState<Cliente[]>([])

  useEffect(() => {
    getClients().then((data) => {
      if(!data)return
      setClients(data)
    })
  },[])

  return {
    clients
  }
}
