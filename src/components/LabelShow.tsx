import { InputText } from 'primereact/inputtext'
import { useState } from 'react'

interface LabelShowProps {
    label: string
    value?: string | number
    order?: 'column' | 'row'
    editable?: boolean
}
export const LabelShow: React.FC<LabelShowProps> = ({ label, value, order,editable }) => {

  const [valueInput, setValueInput] = useState(value)

  return(
    <div className={'label-show items-center gap-2 ' + (order === 'column' ? 'flex-col text-start' : 'flex-row')} >
      <span className={'label text-gray-400 text-md font-bold' + (order === 'column' && 'w-fit')}>{label}:</span>
      {editable ?
        <InputText value={valueInput?.toString()} onChange={(e) => setValueInput(e.target.value)} className='p-inputtext-sm w-full'/>
        :
        <span className={'value ' + (order === 'column' && 'text-center')} >{value}</span>
      }
    </div>
  )
}
