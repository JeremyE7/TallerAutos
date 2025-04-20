import React, { useEffect, useState } from 'react'
import { Galleria } from 'primereact/galleria'
import { Loader } from './Loader/Loader'
import { Foto } from '@/app/types'

interface GalleryOrderProps {
  orderPhotos: Foto
}

interface PhotoGalleryProps {
  source?: string
  alt?: string
}

export default function GalleryyOrder ({ orderPhotos }: GalleryOrderProps) {

  const [images, setImages] = useState<PhotoGalleryProps[]>([])

  useEffect(() => {
    if (orderPhotos) {
      setImages([
        { source: orderPhotos.frontal, alt: 'Imagen frontal del vehiculo' },
        { source: orderPhotos.trasera, alt: 'Imagen trasera del vehiculo' },
        { source: orderPhotos.derecha, alt: 'Imagen lateral derecha del vehiculo' },
        { source: orderPhotos.izquierda, alt: 'Imagen lateral izquierda del vehiculo' },
        { source: orderPhotos.superior, alt: 'Imagen superior del vehiculo' },
        { source: orderPhotos.interior, alt: 'Imagen interior del vehiculo' }
      ])
    }
  }, [orderPhotos])

  const itemTemplate = (photo: PhotoGalleryProps) => {
    return <img src={photo.source ?? undefined} alt={photo.alt} style={{ width: '100%', display: 'block' }} />
  }

  if (!images) return <Loader widthPercentaje={50} heightPercentaje={50} />

  return (
    <div className='flex justify-content-center'>
      <Galleria value={images} numVisible={6} circular
        showItemNavigators showItemNavigatorsOnHover showIndicators
        showThumbnails={false} item={itemTemplate} className='w-96' />
    </div>
  )
}
