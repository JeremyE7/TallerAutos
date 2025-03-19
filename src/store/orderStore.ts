import { OrdenTrabajo } from '@/app/types'
import { create } from 'zustand'

interface OrderStore {
  orders: OrdenTrabajo[]
  filteredOrders: OrdenTrabajo[]
  addOrder: (order: OrdenTrabajo) => void
  removeOrder: (id: number) => void
  updateOrder: (id: number, updatedOrder: OrdenTrabajo) => void,
  setOrders: (orders: OrdenTrabajo[]) => void
  clearOrders: () => void
  resetFilteredOrders: () => void
  setFilteredOrders: (orders: OrdenTrabajo[]) => void
}

export const orderStore = create<OrderStore>((set) => ({
  orders: [], // Estado inicial
  filteredOrders: [],

  addOrder: (order) => set((state) => ({
    orders: [...state.orders, order]
  })),

  removeOrder: (id) => set((state) => ({
    orders: state.orders.filter((order) => {
      return order.id !== id
    })
  })),

  updateOrder: (id, updatedOrder) =>
    set((state) => ({
      orders: state.orders.map((order) =>{
        console.log('order.id:', order.id, id)
        return  order.id === id ? { ...order, ...updatedOrder } : order
      }
      )
    })),

  setOrders: (orders: OrdenTrabajo[]) => set(() => ({
    orders: orders,
    filteredOrders: orders
  })),

  setFilteredOrders: (orders: OrdenTrabajo[]) => set(() => ({
    filteredOrders: orders
  })),

  clearOrders: () => set(() => ({ orders: [] })),

  resetFilteredOrders: () => set((state) => ({ filteredOrders: state.orders }))
}))

