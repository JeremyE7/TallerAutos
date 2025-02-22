'use client'

import { OrdenTrabajo } from '@/app/types'
import { getOrders } from '@/utils/orders'
import { useEffect, useState } from 'react'

export const useOrders = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState<OrdenTrabajo[]>([])


  useEffect(() => {
    setIsLoading(true)
    getOrders().then((data) => {
      if(!data)return
      setOrders(data)
      setIsLoading(false)
    })
  },[])



  return {
    orders,
    isLoading
  }

}
