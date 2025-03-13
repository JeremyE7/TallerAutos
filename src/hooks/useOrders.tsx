'use client'

import { orderStore } from '@/store/orderStore'
import { getOrders } from '@/utils/orders'
import { useEffect } from 'react'

export const useOrders = () => {
  const {setOrders,orders,filteredOrders,setFilteredOrders, updateOrder} = orderStore()


  useEffect(() => {
    getOrders().then((data) => {
      if(!data)return
      setOrders(data)
    })
  },[])



  return {
    orders,
    setOrders,
    filteredOrders,
    setFilteredOrders,
    updateOrder
  }

}
