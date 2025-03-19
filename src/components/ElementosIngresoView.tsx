import { ElementosIngreso } from '@/app/types'
import { formatText } from '@/utils/general'
import { Chip } from 'primereact/chip'
import { useEffect, useState } from 'react'

interface ElementsIncomeCheckboxProps {
    elements: ElementosIngreso,
    className?: string
}

export const ElementosIngresoView: React.FC<ElementsIncomeCheckboxProps> = ({ elements, className }) => {

  const [elementsArray, setElementsArray] = useState<[string, boolean][]>([])

  useEffect(() => {
    if(!elements) return

    const elementsArray = Object.entries(elements).sort((a, b) => b[1] - a[1])

    setElementsArray(elementsArray)
  }, [elements])


  return (
    <div className={'elementos-ingreso-container ' + className}>
      {elementsArray.map(([key, value]) => {
        if (key === 'id' || key === 'combustible') return null
        if(key === 'limpiaparabrisas') key = 'Limpia Parabrisas'
        return (
          <Chip key={key} label={formatText(key)} className={(value ? 'bg-primary' : 'bg_primar-reverse') + ' text-left'} icon={value ? 'pi pi-check-circle' : 'pi pi-times-circle' }/>
        )
      })}
    </div>
  )
}
