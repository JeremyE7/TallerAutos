'use client'

import { Foto, OrdenTrabajo } from '@/app/types'
import { orderStore } from '@/store/orderStore'
import { editElementosIngreso } from '@/utils/ElementosIngreso'
import { editFotos } from '@/utils/fotos'
import { deleteOrder, editOrder, getOrders } from '@/utils/orders'
import { useEffect } from 'react'

export const useOrders = () => {
  const {setOrders,orders,filteredOrders,setFilteredOrders, updateOrder, resetFilteredOrders, removeOrder} = orderStore()

  useEffect(() => {
    if(orders.length > 0) return
    getAllOrders()
  },[])

  const getAllOrders = async () => {
    const data = await getOrders()
    if(!data)return
    setOrders(data)
  }

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

  const saveFotos = async (id: number, fotos: Omit<Foto, 'id'>) => {
    // console.log('Saving edited fotos:', editedOrder.foto)
    // updateOrder(editedOrder.id, editedOrder)
    // resetFilteredOrders()
    if(fotos === undefined) return
    const editedFotos = await editFotos(id, fotos)
    // console.log('editedFotos:', editedFotos)
    return editedFotos
  }

  return {
    orders,
    setOrders,
    filteredOrders,
    setFilteredOrders,
    updateOrder,
    saveEditedOrder,
    eliminateOrder,
    saveElementosIngreso,
    getAllOrders,
    saveFotos
  }

}
