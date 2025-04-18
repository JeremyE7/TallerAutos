import { Foto } from '@/app/types'
import { Button } from 'primereact/button'
import { FileUpload, FileUploadHandlerEvent, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, ItemTemplateOptions } from 'primereact/fileupload'
import { ProgressBar } from 'primereact/progressbar'
import { Tag } from 'primereact/tag'
import { Tooltip } from 'primereact/tooltip'
import { useRef, useState } from 'react'
import { settingsStore } from '@/store/settingsStore'

interface UploaderImagesCreateProps {
    onUpload: (fotos: Omit<Foto, 'id'>) => Promise<void>;
    initialFotos?: Omit<Foto, 'id'>;
}

export const UploaderImagesCreate: React.FC<UploaderImagesCreateProps> = ({
  onUpload,
  initialFotos = {
    frontal: undefined,
    trasera: undefined,
    derecha: undefined,
    izquierda: undefined,
    superior: undefined,
    interior: undefined
  }
}) => {
  const [totalSize, setTotalSize] = useState(0)
  const fileUploadRef = useRef<FileUpload>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFotos, setUploadedFotos] = useState<Omit<Foto, 'id'>>(initialFotos)
  const { setError, setSuccess } = settingsStore()

  const numberOfImages = Object.values(uploadedFotos).filter(Boolean).length

  const onTemplateSelect = (e: FileUploadSelectEvent) => {
    let _totalSize = totalSize
    const files = e.files

    for (let i = 0; i < files.length; i++) {
      _totalSize += files[i].size || 0
    }

    setTotalSize(_totalSize)
  }

  const onTemplateUpload = async (event: FileUploadHandlerEvent) => {
    // Validaciones
    if (totalSize > 6000000) {
      setError('El tamaño máximo total es de 6 MB')
      return
    }
    if (event.files.length > (6 - numberOfImages)) {
      setError(`Puedes subir máximo ${6 - numberOfImages} imágenes más`)
      return
    }

    setIsLoading(true)

    const fotosToAdd: Omit<Foto, 'id'> = {}
    const availablePositions = Object.entries(uploadedFotos)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    try {
      const filePromises = event.files.map((file: File, index) => {
        return new Promise<void>((resolve) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => {
            const base64String = reader.result as string
            fotosToAdd[availablePositions[index] as keyof typeof fotosToAdd] = base64String
            resolve()
          }
        })
      })

      await Promise.all(filePromises)

      // Actualizar estado local primero
      const newFotos = { ...uploadedFotos, ...fotosToAdd }
      setUploadedFotos(newFotos)

      // Llamar a la función de upload proporcionada
      await onUpload(fotosToAdd)

      setSuccess('Fotos agregadas correctamente')
      setTotalSize(0) // Resetear el tamaño después de subir
    } catch (error) {
      console.error('Error uploading images:', error)
      setError('Error al subir las imágenes')
      // Revertir cambios en caso de error
      setUploadedFotos(uploadedFotos)
    } finally {
      setIsLoading(false)
    }
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
    const formatedValue = fileUploadRef.current?.formatSize(totalSize) ?? '0 B'

    return (
      <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
        {isLoading ? (
          <Button type="button" icon="pi pi-spin pi-spinner" className="p-button-outlined p-button-rounded p-button-info" disabled />
        ) : (
          <>
            {chooseButton}
            {uploadButton}
            {cancelButton}
          </>
        )}
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
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={(event) => onTemplateRemove(file, () => props.onRemove(event))}
        />
      </div>
    )
  }

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
        <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Arrastra tus imágenes aquí
        </span>
      </div>
    )
  }

  const chooseOptions = {
    icon: 'pi pi-fw pi-images',
    iconOnly: true,
    className: 'custom-choose-btn p-button-rounded p-button-outlined'
  }

  const uploadOptions = {
    icon: 'pi pi-fw pi-cloud-upload',
    iconOnly: true,
    className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined'
  }

  const cancelOptions = {
    icon: 'pi pi-fw pi-times',
    iconOnly: true,
    className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'
  }

  return (
    <div className='px-10 flex flex-col gap-5 justify-center'>
      <Tooltip target=".custom-choose-btn" content="Escoger imágenes" position="bottom" />
      <Tooltip target=".custom-upload-btn" content="Subir" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Limpiar" position="bottom" />

      <FileUpload
        ref={fileUploadRef}
        multiple
        accept="image/*"
        maxFileSize={1000000}
        customUpload
        uploadHandler={onTemplateUpload}
        onSelect={onTemplateSelect}
        onError={onTemplateClear}
        onClear={onTemplateClear}
        headerTemplate={headerTemplate}
        itemTemplate={itemTemplate}
        emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions}
        uploadOptions={uploadOptions}
        cancelOptions={cancelOptions}
        contentClassName='h-70 overflow-y-scroll'
      />
    </div>
  )
}
