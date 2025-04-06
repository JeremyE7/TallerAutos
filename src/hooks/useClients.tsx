import { Cliente } from '@/app/types'
import { editClient, getClients } from '@/utils/client'
import { useEffect } from 'react'
import { clientStore } from '@/store/clientStore'
import { useSettings } from './useSettings'

export const useClients = () => {
  const {clients, setClients, updateClient} = clientStore()
  const {clientKey} = useSettings()

  useEffect(() => {
    if(clients.length > 0) return
    gellAllClients()
  },[])

  const gellAllClients = async () => {
    const data = await getClients()
    if(!data)return
    setClients(data)
  }

  const saveEditedClient = async (client: Cliente) => {
    const {id, ...clientWithoutId} = client
    
    const data = await editClient(id, clientWithoutId, clientKey)
    if(!data)return
    updateClient(id, client)
    return data
  }

  const getClientById = (id: number) => {
    return clients.find(client => client.id === id)
  }

  return {
    clients,
    saveEditedClient,
    gellAllClients,
    getClientById
  }
}
