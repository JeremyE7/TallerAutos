'use client'

import { Foto, OrdenTrabajo } from '@/app/types'
import { orderStore } from '@/store/orderStore'
import { editElementosIngreso } from '@/utils/ElementosIngreso'
import { deleteOrder, deleteOrderFoto, editOrder, getOrders, printOrder as printOrderFunction, createOrder } from '@/utils/orders'
import { useEffect } from 'react'
import { createFotos, editFotos } from '@/utils/fotos'
import { settingsStore } from '@/store/settingsStore'

export const useOrders = () => {
  const { setOrders, orders, filteredOrders, setFilteredOrders, updateOrder, resetFilteredOrders, removeOrder, updateFotosOrder, addOrder } = orderStore()
  const { clientKey } = settingsStore()

  useEffect(() => {
    if (orders.length > 0) return
    getAllOrders()
  }, [])


  const printOrder = async (id: number) => {
    return printOrderFunction(id, clientKey)
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

  const createOrderFotos = async (id: number, fotos: Omit<Foto, 'id'>) => {
    if (!fotos) return
    const createdFotos = await createFotos(id, fotos, clientKey)
    if (!createdFotos) return
    updateFotosOrder(id, createdFotos)
    resetFilteredOrders()
    return createdFotos
  }

  // Esto es para editar xD
  const saveFotos = async (id: number, fotos: Omit<Foto, 'id'>) => {
    if (fotos === undefined) return
    console.log('fotos dentro del useorders:', fotos)
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

  const saveNewOrder = async (order: OrdenTrabajo, fotos: Omit<Foto, 'id'>) => {
    try {
      let newOrder = await createOrder(order, clientKey)
      if (!newOrder || !newOrder.foto) return
      const newFotos = await saveFotos(newOrder.foto.id, fotos)
      if (!newFotos) return
      newOrder = { ...newOrder, foto: newFotos }
      console.log('new order:', newOrder)
      addOrder(newOrder)
      resetFilteredOrders()
      return newOrder
    } catch (error) {
      console.error('Error saving order:', error)
    }
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
    saveNewOrder,
    getOrderById,
    createOrderFotos
  }

}
