import { InputText } from 'primereact/inputtext'
import { KeyFilterType } from 'primereact/keyfilter'

interface LabelShowProps {
    label: string
    value?: string | number
    order?: 'column' | 'row'
    editable?: boolean
    onChange?: (value: string) => void
    type?: KeyFilterType
}
export const LabelShow: React.FC<LabelShowProps> = ({ label, value, order,editable, onChange, type }) => {


  return(
    <div className={'label-show items-center gap-2 ' + (order === 'column' ? 'flex-col text-start' : 'flex-row')} >
      <span className={'label text-gray-400 text-md font-bold' + (order === 'column' && 'w-fit')}>{label}:</span>
      {editable ?
        <InputText value={value?.toString()} onChange={(e) => onChange?.(e.target.value)} className='p-inputtext-sm w-full' keyfilter={type}/>
        :
        <span className={'value ' + (order === 'column' && 'text-center')} >{value}</span>
      }
    </div>
  )
}
