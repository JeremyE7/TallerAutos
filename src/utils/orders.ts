import { OrdenTrabajo } from '@/app/types'

export const getOrders = async () => {
  //Hacer fetch al mockdata
  const response = await fetch('mocks/mockOrders.json')
  const data: OrdenTrabajo[] = await response.json()
  return data
}
