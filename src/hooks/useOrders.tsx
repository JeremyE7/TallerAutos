'use client'

import { Foto, OrdenTrabajo } from '@/app/types'
import { orderStore } from '@/store/orderStore'
import { editElementosIngreso } from '@/utils/ElementosIngreso'
import { saveOrder, deleteOrder, deleteOrderFoto, editOrder, getOrders, printOrder as printOrderFunction } from '@/utils/orders'
import { useEffect } from 'react'
import { editFotos } from '@/utils/fotos'

export const useOrders = () => {
  const { setOrders, orders, filteredOrders, setFilteredOrders, updateOrder, resetFilteredOrders, removeOrder, updateFotosOrder } = orderStore()

  useEffect(() => {
    if (orders.length > 0) return
    getAllOrders()
  }, [])


  const printOrder = async (id: number) => {
    return printOrderFunction(id);
  }

  const getOrderById = async (id: number) => {
    let order = orders.find((order) => order.id === id)

    // Si no se encuentra en memoria, fuerza la recarga
    if (!order) {
      console.log('Orden no encontrada en memoria, buscando en backend...')
      await getAllOrders()
      order = orderStore.getState().orders.find((o) => o.id === id)
    }

    console.log('order by id:', order)
    return order
  }


  const getAllOrders = async () => {
    const data = await getOrders()
    console.log('data xdasdas:', data)
    if (!data) return
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
    if (fotos === undefined) return
    const editedFotos = await editFotos(id, fotos)
    if (!editedFotos) return
    updateFotosOrder(id, editedFotos)
    resetFilteredOrders()
    console.log('editedFotos:', editedFotos)
    return editedFotos
  }

  const deleteFoto = async (id: number, attributeToDelete: string) => {
    console.log('Deleting foto:', id, attributeToDelete)
    const deletedFoto = await deleteOrderFoto(id, attributeToDelete)
    if (!deletedFoto) return
    updateFotosOrder(id, deletedFoto)
    resetFilteredOrders()
    console.log('deletedFoto:', deletedFoto)
    return deletedFoto
  }

  const saveOrder = async (order: OrdenTrabajo) => {
    console.log('Saving order:', order)
    return await saveOrder(order)
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
    saveOrder,
    getOrderById
  }

}
