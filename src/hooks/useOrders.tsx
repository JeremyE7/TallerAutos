'use client'

import { OrdenTrabajo } from '@/app/types'
import { getOrders } from '@/utils/orders'
import { useEffect, useState } from 'react'

export const useOrders = () => {
  const [orders, setOrders] = useState<OrdenTrabajo[]>([])


  useEffect(() => {
    getOrders().then((data) => {
      if(!data)return
      setOrders(data)
    })
  },[])



  return {
    orders
  }

}
