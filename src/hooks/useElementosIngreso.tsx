import { createElementosIngreso } from '@/utils/ElementosIngreso'
import { useSettings } from './useSettings'
import { ElementosIngreso } from '@/app/types'

export const useElementosIngreso = () => {
  const { clientKey } = useSettings()

  const newElementosIngreso = async (elementosIngreso: ElementosIngreso) => {
    const data = await createElementosIngreso(elementosIngreso, clientKey)
    if (!data) return
    return data
  }

  return {
    newElementosIngreso
  }
}
