import { Cliente } from '@/app/types'
import { create } from 'zustand'

interface ClientStore {
    clients: Cliente[]
    addClient: (client: Cliente) => void
    removeClient: (id: number) => void
    updateClient: (id: number, updatedClient: Cliente) => void
    setClients: (clients: Cliente[]) => void
    clearClients: () => void
}

export const clientStore = create<ClientStore>((set) => ({
  clients: [], // Estado inicial

  addClient: (client) => set((state) => ({
    clients: [...state.clients, client]
  })),

  removeClient: (id) => set((state) => ({
    clients: state.clients.filter(client => client.id !== id)
  })),

  updateClient: (id, updatedClient) => set((state) => ({
    clients: state.clients.map(client => client.id === id ? updatedClient : client)
  })),

  setClients: (clients) => set(() => ({
    clients
  })),

  clearClients: () => set(() => ({
    clients: []
  }))
}))
