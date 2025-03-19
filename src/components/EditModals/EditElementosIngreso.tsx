import { ElementosIngreso, ModalProps } from '@/app/types'
import { ElementoIngresoSelectItem, parseElementosIngreso } from '@/utils/ElementosIngreso'
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect'
import { useMemo, useState } from 'react'
import { ElementosIngresoView } from '../ElementosIngresoView'
import { Knob, KnobChangeEvent } from 'primereact/knob'
import { Button } from 'primereact/button'

interface EditElementosIngresoProps {
    orderToEdit: ModalProps,
    setOrderToEdit: (modal: ModalProps) => void
}

export const EditElementosIngreso: React.FC<EditElementosIngresoProps> = ({ orderToEdit, setOrderToEdit }) => {
  const copyOrderToEdit = useMemo(() => structuredClone(orderToEdit), [])
  const parsedElementosIngreso = parseElementosIngreso(copyOrderToEdit.elementosIngreso || null)
  const [selectedElements, setSelectedElements] = useState<ElementoIngresoSelectItem[]>(parsedElementosIngreso.filter(e => e.code ))
  const [elementsToDisplay, setElementsToDisplay] = useState<ElementosIngreso | null>(orderToEdit.elementosIngreso || null)

  const handleChange = (e: MultiSelectChangeEvent) => {
    console.log('e.target.value:', e.target.value)

    setSelectedElements(e.target.value)
    const elementesSelected = parsedElementosIngreso.reduce((acc: ElementosIngreso, element: ElementoIngresoSelectItem) => {
      if (e.target.value.find((e: ElementoIngresoSelectItem) => e.name === element.name)) {
        if(element.name === 'id' || element.name === 'combustible') {
          acc[element.name] = Number(element.code)
        }else{
          acc[element.name] = true
        }
      } else {
        acc[element.name] = false
      }

      return acc
    }
    , {} as ElementosIngreso)

    setElementsToDisplay(elementesSelected)
    setOrderToEdit({ ...orderToEdit, elementosIngreso: {
      ...elementesSelected,
      id: orderToEdit.elementosIngreso?.id ?? 0,
      combustible: orderToEdit.elementosIngreso?.combustible ?? 0
    } })
  }

  const handleChangeCombustible = (e: KnobChangeEvent) => {
    if(!orderToEdit.elementosIngreso) return
    setOrderToEdit({ ...orderToEdit, elementosIngreso: {
      ...orderToEdit.elementosIngreso,
      combustible: e.value
    } })
  }

  const handleAddCombustible = (add: number) => {
    if(!orderToEdit.elementosIngreso || !orderToEdit.elementosIngreso.combustible) return
    if(orderToEdit.elementosIngreso.combustible + add < 0 || orderToEdit.elementosIngreso.combustible + add > 100) return
    setOrderToEdit({ ...orderToEdit, elementosIngreso: {
      ...orderToEdit.elementosIngreso,
      combustible: orderToEdit.elementosIngreso.combustible + add
    } })
  }

  return (
    <div className='px-10 overflow-x-hidden flex h-full flex-col md:flex-row'>
      <div className='flex flex-col w-full md:w-7/12! items-center h-full'>
        <MultiSelect
          value={selectedElements}
          onChange={handleChange}
          options={parsedElementosIngreso}
          optionLabel="label"
          display="chip"
          placeholder="Selecciona algunos elementos"
          maxSelectedLabels={10}
          className="w-full p-2 "
          filter
        />
        <div className='nob-container'>
          <Knob value={orderToEdit.elementosIngreso?.combustible} min={0} max={100} className='pt-4 w-fit' onChange={(e) => handleChangeCombustible(e)}/>
          <div className='flex gap-2.5 mt-2 justify-center items-center'>
            <Button severity="secondary" onClick={() => handleAddCombustible(-1)}>-</Button>
            <h2>Gasolina</h2>
            <Button severity="secondary" onClick={() => handleAddCombustible(1)}>+</Button>
          </div>
        </div>
      </div>
      { elementsToDisplay &&
          <ElementosIngresoView elements={elementsToDisplay} className='overflow-y-scroll h-full p-1 mt-20 md:mt-0 w-9/12 ml-1 hidden md:grid!' />
      }
    </div>
  )
}
