import { Vehiculo } from '@/app/types'
import { vehicleStore } from '@/store/vehicleStore'
import { editVehicle, getVehicles } from '@/utils/vehicle'
import { useEffect } from 'react'

export const useVehicle = () => {
  const {setVehicles, updateVehicle, vehicles} = vehicleStore()

  useEffect(() => {
    if(vehicles.length === 0){
      getAllVehicles()
    }
  },[])

  const getAllVehicles = async () => {
    const response = await getVehicles()
    if(response){
      setVehicles(response)
    }
  }

  const getVehicleById = (id: number) => {
    return vehicles.find(vehicle => vehicle.id === id)
  }

  const saveEditedVehicle = (updatedVehicle: Vehiculo) => {
    const {id, cliente, ...vehicleWithoutId} = updatedVehicle
    console.log(cliente)
    updateVehicle(id, updatedVehicle)
    const data = editVehicle(id, vehicleWithoutId)
    return data
  }

  return {
    vehicles,
    getVehicleById,
    saveEditedVehicle,
    getAllVehicles
  }
}
