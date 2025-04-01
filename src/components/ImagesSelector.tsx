import { Foto, ModalProps } from '@/app/types'
import { useOrders } from '@/hooks/useOrders'
import { Button } from 'primereact/button'
import { Image } from 'primereact/image'
import { ProgressBar } from 'primereact/progressbar'
import { Toast } from 'primereact/toast'
import { RefObject, useState } from 'react'

interface ImageSelectorProps {
  fotos: Foto,
  setOrderToEdit?: (modal: ModalProps) => void
  toastRef: RefObject<Toast | null>;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({ fotos, setOrderToEdit, toastRef }) => {

  const [loadingDelete, setLoadingDelete] = useState(false)
  const { deleteFoto } = useOrders()
  const onDeleteFoto = (key: keyof Foto) => {
    const updatedFotos = { ...fotos, [key]: null }
    if (setOrderToEdit) {
      setLoadingDelete(true)
      deleteFoto(fotos.id, key).then((data) => {
        if (data) {
          setOrderToEdit({ fotos: updatedFotos })
          toastRef.current?.show({ severity: 'info', summary: 'Success', detail: 'Foto eliminada con exito', life: 3000 })
        }
        setLoadingDelete(false)
      })
    }
  }
  return (
    <div className='w-2xl'>
      <h2>Imagenes de la orden</h2>
      <ul className='img-list'>
        {loadingDelete ? <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
          : (
            <>
              {fotos.frontal && (
                <li>
                  <Image src={fotos.frontal} alt="Frontal" width={'100'} preview />
                  <p>Imagen frontal del vehiculo</p>
                  <Button icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onDeleteFoto('frontal')} />
                </li>
              )}
              {fotos.trasera && (
                <li>
                  <Image src={fotos.trasera} alt="Trasera" width={'100'} preview />
                  <p>Imagen trasera del vehiculo</p>
                  <Button icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onDeleteFoto('trasera')} />
                </li>
              )}
              {fotos.derecha && (
                <li>
                  <Image src={fotos.derecha} alt="Derecha" width={'100'} preview />
                  <p>Imagen lateral derecha del vehiculo</p>
                  <Button icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onDeleteFoto('derecha')} />
                </li>
              )}
              {fotos.izquierda && (
                <li>
                  <Image src={fotos.izquierda} alt="Izquierda" width={'100'} preview />
                  <p>Imagen lateral izquierda del vehiculo</p>
                  <Button icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onDeleteFoto('izquierda')} />
                </li>
              )}
              {fotos.superior && (
                <li>
                  <Image src={fotos.superior} alt="Superior" width={'100'} preview />
                  <p>Imagen superior del vehiculo</p>
                  <Button icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onDeleteFoto('superior')} />
                </li>
              )}
              {fotos.interior && (
                <li>
                  <Image src={fotos.interior} alt="Interior" width={'100'} preview />
                  <p>Imagen interior del vehiculo</p>
                  <Button icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onDeleteFoto('interior')} />
                </li>
              )}
            </>
          )}
      </ul>
    </div>

  )

}
