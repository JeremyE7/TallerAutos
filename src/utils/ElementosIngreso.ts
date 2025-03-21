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

export const editElementosIngreso = (id: number, elementosIngreso: ElementosIngreso) => {
  try {
    // Obtener los elementos de ingreso almacenados
    const storedElementosIngreso = localStorage.getItem('elementos_ingreso')
    if (storedElementosIngreso) {
      const data: Response<ElementosIngreso[]> = JSON.parse(storedElementosIngreso)
      if (data.code !== 200) {
        console.error('Error fetching elementos de ingreso:', data.message)
        return
      }

      // Buscar y editar el elemento de ingreso con el id proporcionado
      const updatedElementosIngreso = data.data?.map((existingElement) =>
        existingElement.id === id ? { ...existingElement, ...elementosIngreso } : existingElement
      )

      // Guardar la lista de elementos de ingreso actualizada en el localStorage
      localStorage.setItem('elementos_ingreso', JSON.stringify({ ...data, data: updatedElementosIngreso }))
      console.info('Elemento de ingreso editado correctamente')
      return updatedElementosIngreso
    } else {
      console.error('No elementos de ingreso encontrados en local storage')
    }
  } catch (error) {
    console.error('Error editing elementos de ingreso in local storage:', error)
  }
}
