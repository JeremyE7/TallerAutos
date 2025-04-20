import { ElementosIngreso, Response } from '@/app/types'
import { encryptText, formatText } from './general'
import { settingsStore } from '@/store/settingsStore'

export interface ElementoIngresoSelectItem {
  name: string
  code: string
  label: string
}

const { setError } = settingsStore.getState()


export const parseElementosIngreso = (elementosIngreso: ElementosIngreso | null): ElementoIngresoSelectItem[] => {
  if (!elementosIngreso) return []
  const pairs = Object.entries(elementosIngreso)
  return pairs
    .map(([key, value]) => {
      if (key === 'id' || key === 'combustible') return null
      return {
        label: formatText(key),
        name: key,
        code: value
      }
    })
    .filter((item): item is ElementoIngresoSelectItem => item !== null)
}

export const createElementosIngreso = async (elementosIngreso: ElementosIngreso, clientKey: string) => {
  try {
    const response = await fetch('api/elementos_ingreso', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client-key': encryptText(clientKey, 'vinicarJOSEJEREMYXD')
      },
      body: JSON.stringify(elementosIngreso)
    })

    const data: Response<ElementosIngreso> = await response.json()
    if (data.code !== 200) {
      console.error('Error creating elementos de ingreso:', data.message)
      setError(data.message)
      return
    }

    console.info(data.message)
    return data.data
  } catch (error) {
    setError('Error interno del servidor. Por favor intente de nuevo más tarde.')
    console.error('Error creating elementos de ingreso:', error)
  }
}

export const editElementosIngreso = async (id: number, elementosIngreso: ElementosIngreso, clientKey: string) => {
  try {
    const response = await fetch(`api/elementos_ingreso/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'client-key': encryptText(clientKey, 'vinicarJOSEJEREMYXD')
      },
      body: JSON.stringify(elementosIngreso)
    })

    const data: Response<ElementosIngreso> = await response.json()
    if (data.code !== 200) {
      console.error('Error updating elementos de ingreso:', data.message)
      setError(data.message)
      return
    }

    console.info(data.message)
    return data.data

  } catch (error) {
    setError('Error interno del servidor. Por favor intente de nuevo más tarde.')
    console.error('Error updating elementos de ingreso:', error)
  }
}
