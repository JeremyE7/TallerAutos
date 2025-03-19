'use client'

import { OrdenTrabajo } from '@/app/types'
import { orderStore } from '@/store/orderStore'
import { editElementosIngreso } from '@/utils/ElementosIngreso'
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
    console.log('Saving edited order:', editedOrder)

    updateOrder(editedOrder.id, editedOrder)
    resetFilteredOrders()
    const editedOrderAux = await editOrder(editedOrder.id, editedOrder)
    console.log('editedOrderAux:', editedOrderAux)
    return editedOrderAux
  }

  const eliminateOrder = async (id: number) => {
    removeOrder(id)
    resetFilteredOrders()
    const deletedOrder = await deleteOrder(id)
    return deletedOrder
  }

  const saveElementosIngreso = async (editedOrder: OrdenTrabajo) => {
    console.log('Saving edited elementos de ingreso:', editedOrder.elementosIngreso)
    updateOrder(editedOrder.id, editedOrder)
    resetFilteredOrders()
    const editedElementosIngreso = await editElementosIngreso(editedOrder.elementosIngreso.id, editedOrder.elementosIngreso)
    console.log('editedElementosIngreso:', editedElementosIngreso)
    return editedElementosIngreso
  }

  return {
    orders,
    setOrders,
    filteredOrders,
    setFilteredOrders,
    updateOrder,
    saveEditedOrder,
    eliminateOrder,
    saveElementosIngreso
  }

}
