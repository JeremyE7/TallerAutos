interface LabelShowProps {
    label: string
    value?: string | number
    order?: 'column' | 'row'
}
export const LabelShow: React.FC<LabelShowProps> = ({ label, value, order }) => {
  return(
    <div className={'label-show items-center gap-2 ' + (order === 'column' ? 'flex-col text-start' : 'flex-row')} >
      <span className={'label text-gray-400 text-md font-bold ' + (order === 'column' && 'w-fit')}>{label}:</span>
      <span className={'value ' + (order === 'column' && 'text-center')} >{value}</span>
    </div>
  )
}
