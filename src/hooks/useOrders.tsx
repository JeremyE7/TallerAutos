'use client'

import { Foto, OrdenTrabajo } from '@/app/types'
import { orderStore } from '@/store/orderStore'
import { editElementosIngreso } from '@/utils/ElementosIngreso'
import { deleteOrder, deleteOrderFoto, editOrder, getOrders, printOrder as printOrderFunction } from '@/utils/orders'
import { useEffect } from 'react'
import { editFotos } from '@/utils/fotos'
import { settingsStore } from '@/store/settingsStore'

export const useOrders = () => {
  const { setOrders, orders, filteredOrders, setFilteredOrders, updateOrder, resetFilteredOrders, removeOrder, updateFotosOrder } = orderStore()
  const {clientKey} = settingsStore()

  useEffect(() => {
    if (orders.length > 0) return
    getAllOrders()
  }, [])


  const printOrder = async (id: number) => {
    return printOrderFunction(id, clientKey);
  }

  const getAllOrders = async () => {
    const data = await getOrders()
    if (!data) return
    setOrders(data)
  }

  const saveEditedOrder = async (editedOrder: OrdenTrabajo) => {
    const editedOrderAux = await editOrder(editedOrder.id, editedOrder, clientKey)
    if (!editedOrderAux) return    
    updateOrder(editedOrder.id, editedOrder)
    resetFilteredOrders()
    return editedOrderAux
  }

  const eliminateOrder = async (id: number) => {
    const deletedOrder = await deleteOrder(id, clientKey)
    if (!deletedOrder) return
    removeOrder(id)
    resetFilteredOrders()
    return deletedOrder
  }

  const saveElementosIngreso = async (editedOrder: OrdenTrabajo) => {
    const editedElementosIngreso = await editElementosIngreso(editedOrder.elementosIngreso.id, editedOrder.elementosIngreso, clientKey)
    if (!editedElementosIngreso) return
    updateOrder(editedOrder.id, editedOrder)
    resetFilteredOrders()
    return editedElementosIngreso
  }

  const saveFotos = async (id: number, fotos: Omit<Foto, 'id'>) => {
    if (fotos === undefined) return
    const editedFotos = await editFotos(id, fotos, clientKey)
    if (!editedFotos) return
    updateFotosOrder(id, editedFotos)
    resetFilteredOrders()
    return editedFotos
  }

  const deleteFoto = async (id: number, attributeToDelete: string) => {
    const deletedFoto = await deleteOrderFoto(id, attributeToDelete, clientKey)
    if (!deletedFoto) return
    updateFotosOrder(id, deletedFoto)
    resetFilteredOrders()
    return deletedFoto
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
    printOrder,
    getAllOrders,
    saveFotos,
    deleteFoto,
  }

}
