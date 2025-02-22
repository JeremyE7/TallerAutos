import React, { useState } from 'react'
import { Galleria } from 'primereact/galleria'

export default function GalleryyOrder () {
  const [images, setImages] = useState(null)

  const itemTemplate = (item) => {
    return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', display: 'block' }} />
  }

  const thumbnailTemplate = (item) => {
    return <img src={item.thumbnailImageSrc} alt={item.alt} style={{ display: 'block' }} />
  }

  return (
    <div className="card">
      <Galleria value={images} numVisible={5} circular style={{ maxWidth: '640px' }}
        showThumbnails={false} showItemNavigators item={itemTemplate} thumbnail={thumbnailTemplate} />
    </div>
  )
}
