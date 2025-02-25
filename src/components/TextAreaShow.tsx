import { InputTextarea } from 'primereact/inputtextarea'

interface TextAreaShowProps {
    label: string
    value?: string
    order?: 'column' | 'row'
}
export const TextAreaShow: React.FC<TextAreaShowProps> = ({ label, value, order }) => {
  return(
    <div className={'text-area-show items-center gap-2 ' + (order === 'column' ? 'flex-col text-start' : 'flex-row')} >
      <span className={'label text-gray-400 text-md font-bold ' + (order === 'column' && 'w-fit')}>{label}:</span>
      <InputTextarea className={'value w-20 ' + (order === 'column' && 'text-center')} rows={5} cols={30} value={value} readOnly autoResize/>
    </div>
  )
}
