import { Foto } from '@/app/types'
import { useOrders } from '@/hooks/useOrders'
import { Button } from 'primereact/button'
import { FileUpload, FileUploadHandlerEvent, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, ItemTemplateOptions } from 'primereact/fileupload'
import { ProgressBar } from 'primereact/progressbar'
import { Tag } from 'primereact/tag'
import { Toast } from 'primereact/toast'
import { Tooltip } from 'primereact/tooltip'
import { useRef, useState } from 'react'

interface UploaderImagesProps {
  fotos: Foto
}

export const UploaderImages: React.FC<UploaderImagesProps> = ({fotos}) => {
  const toastRef = useRef<Toast>(null)
  const [totalSize, setTotalSize] = useState(0)
  const fileUploadRef = useRef<FileUpload>(null)
  const {saveFotos} = useOrders()

  const onTemplateSelect = (e: FileUploadSelectEvent) => {
    let _totalSize = totalSize
    const files = e.files

    for (let i = 0; i < files.length; i++) {
      _totalSize += files[i].size || 0
    }

    setTotalSize(_totalSize)
  }

  const onTemplateUpload = (event: FileUploadHandlerEvent) => {
    const fotosAux: Omit<Foto, 'id'> = {}
    const keysOfFoto = Object.keys(fotos).filter((key) => key !== 'id')

    const filePromises = event.files.map((file: File, index) => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          const base64String = reader.result as string
          fotosAux[keysOfFoto[index]] = base64String.split(',')[1]
          resolve()
        }
      })
    })

    Promise.all(filePromises).then(() => {
      saveFotos(fotos.id, fotosAux)
      toastRef.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 1000 })
    })
  }

  const onTemplateRemove = (file: File, callback: () => void) => {
    setTotalSize(totalSize - file.size)
    callback()
  }

  const onTemplateClear = () => {
    setTotalSize(0)
  }

  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
    const { className, chooseButton, uploadButton, cancelButton } = options
    const value = totalSize / 60000
    const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B'

    return (
      <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue} / 6 MB</span>
          <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
        </div>
      </div>
    )
  }

  const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
    const file = inFile as File
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: '60%' }}>
          <img alt={file.name} role="presentation" src={URL.createObjectURL(file)} width={100} />
          <span className="hidden md:flex flex-column text-left ml-3 w-full">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
        <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={(event) => onTemplateRemove(file, () => props.onRemove(event))} />
      </div>
    )
  }

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i className="pi pi-image mt-3 p-5 over" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
        <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Arrasta tus imagenes aqui
        </span>
      </div>
    )
  }

  const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' }
  const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' }
  const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' }

  return (
    <div className='px-10'>
      <Toast ref={toastRef} position='bottom-right' className='w-10 md:w-auto'/>
      <Tooltip target=".custom-choose-btn" content="Escoger imagenes" position="bottom" />
      <Tooltip target=".custom-upload-btn" content="Subir" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Limpiar" position="bottom" />
      <FileUpload ref={fileUploadRef} multiple accept="image/*" maxFileSize={1000000} customUpload
        uploadHandler={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
        headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} contentClassName='h-70 overflow-y-scroll'/>
    </div>
  )
}
