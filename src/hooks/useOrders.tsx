'use client'

import { OrdenTrabajo } from '@/app/types'
import { orderStore } from '@/store/orderStore'
import { deleteOrder, editOrder, getOrders } from '@/utils/orders'
import { useEffect } from 'react'

export const useOrders = () => {
  const {setOrders,orders,filteredOrders,setFilteredOrders, updateOrder, resetFilteredOrders, removeOrder} = orderStore()



  useEffect(() => {
    getOrders().then((data) => {
      if(!data)return
      setOrders(data)
    })
  },[])

  const saveEditedOrder = async (editedOrder: OrdenTrabajo) => {
    updateOrder(editedOrder.id, editedOrder)
    resetFilteredOrders()
    const editedOrderAux = await editOrder(editedOrder.id, editedOrder)
    return editedOrderAux
  }

  const eliminateOrder = async (id: number) => {
    removeOrder(id)
    resetFilteredOrders()
    const deletedOrder = await deleteOrder(id)
    return deletedOrder
  }

  return {
    orders,
    setOrders,
    filteredOrders,
    setFilteredOrders,
    updateOrder,
    saveEditedOrder,
    eliminateOrder
  }

}
