import { OrdenTrabajo, Response } from '@/app/types'

export const getOrders = async () => {
  try{
    const response = await fetch('api/orden')
    const data: Response<OrdenTrabajo[]> = await response.json()
    if(data.code !== 200){
      console.error('Error fetching orders:', data.message)
      return []
    }

    console.info(data.message)
    return data.data

  }catch(error){
    console.error('Error fetching orders:', error)
  }
}
