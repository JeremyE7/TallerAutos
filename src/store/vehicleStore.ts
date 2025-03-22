import { Vehiculo } from '@/app/types'
import { create } from 'zustand'

interface VehicleStore{
    vehicles: Vehiculo[]
    addVehicle: (vehicle: Vehiculo) => void
    removeVehicle: (id: number) => void
    updateVehicle: (id: number, updatedVehicle: Vehiculo) => void
    setVehicles: (vehicles: Vehiculo[]) => void
    clearVehicles: () => void
}

export const vehicleStore = create<VehicleStore>((set) => ({
  vehicles: [],

  addVehicle: (vehicle: Vehiculo) => set((state) => ({
    vehicles: [...state.vehicles, vehicle]
  })),

  removeVehicle: (id: number) => set((state) => ({
    vehicles: state.vehicles.filter(vehicle => vehicle.id !== id)
  })),

  updateVehicle: (id: number, updatedVehicle: Vehiculo) => set((state) => ({
    vehicles: state.vehicles.map(vehicle => vehicle.id === id ? updatedVehicle : vehicle)
  })),

  setVehicles: (vehicles: Vehiculo[]) => set(() => ({
    vehicles
  })),

  clearVehicles: () => set(() => ({
    vehicles: []
  }))
}))
