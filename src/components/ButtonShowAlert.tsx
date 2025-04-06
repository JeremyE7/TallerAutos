import { Button } from 'primereact/button'
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog'

interface ButtonProps {
    severity: 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'help' | 'contrast' | undefined,
    iconButton: string,
    label?: string,
    onAcceptAlert: () => void,
    onRejectAlert?: () => void,
    message?: string,
    header?: string,
    iconAlert?: string,
    defaultFocus?: 'accept' | 'reject',
    classNameButton?: string
}

export const ButtonShowAlert: React.FC<ButtonProps> = ({severity, iconButton, onAcceptAlert, label, onRejectAlert, defaultFocus, header, iconAlert, message, classNameButton}) => {

  const showAlert = () => {
    confirmDialog({
      message,
      header,
      icon: iconAlert,
      defaultFocus,
      accept: onAcceptAlert,
      reject: onRejectAlert,
      closeOnEscape: true
    })
  }

  return(
    <>
      <Button severity={severity} icon={iconButton} onClick={showAlert} label={label} className={classNameButton}/>
    </>
  )
}
