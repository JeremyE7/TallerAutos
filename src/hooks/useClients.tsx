import { Cliente } from '@/app/types'
import { editClient, getClients } from '@/utils/client'
import { useEffect } from 'react'
import { clientStore } from '@/store/clientStore'

export const useClients = () => {
  const {clients, setClients, updateClient} = clientStore()

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
    updateClient(id, client)
    const data = await editClient(id, clientWithoutId)
    if(!data)return
    return data
  }

  const getClient = (id: number) => {
    return clients.find(client => client.id === id)
  }

  return {
    clients,
    saveEditedClient,
    gellAllClients,
    getClient
  }
}
