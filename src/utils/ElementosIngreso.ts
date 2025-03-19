import { ElementosIngreso, Response } from '@/app/types'
import { formatText } from './general'

export interface ElementoIngresoSelectItem {
    name: string
    code: string
    label: string
}

export const parseElementosIngreso = (elementosIngreso: ElementosIngreso | null): ElementoIngresoSelectItem[] => {
  if(!elementosIngreso) return []
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

export const editElementosIngreso = async (id: number, elementosIngreso: ElementosIngreso) => {
  try{
    const response = await fetch(`api/elementos_ingreso/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(elementosIngreso)
    })

    const data: Response<ElementosIngreso> = await response.json()
    if(data.code !== 200){
      console.error('Error updating elementos de ingreso:', data.message)
      return
    }

    console.info(data.message)
    return data.data

  }catch(error){
    console.error('Error updating elementos de ingreso:', error)
  }
}
