'use client'
import { LabelShow } from "@/components/LabelShow";
import { useSettings } from "@/hooks/useSettings";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";

export default function Settings() {

  const {setServerSettings, clientKey } = useSettings()
  const [serverKeyAux, setServerKey] = useState(clientKey)
  const ToastRef = useRef<Toast>(null)

  useEffect(() => {
    setServerKey(clientKey)
  },[clientKey])

  const handleSave = () => {
    setServerSettings(serverKeyAux)
    ToastRef.current?.show({ severity: 'success', summary: 'Guardado', detail: 'Configuración guardada correctamente', life: 3000 })
  }

  const handleChangeKey = (value: string) => {
    setServerKey(value)
  }


  return (
    <section className="flex flex-col gap-4 p-4 ">
      <LabelShow label="Clave de servidor" editable value={serverKeyAux} order="column" onChange={(value) => handleChangeKey(value)}/>
      <Button label="Guardar" icon="pi pi-save" className="p-button-success" onClick={handleSave}/>
      <Toast ref={ToastRef} position="bottom-right" baseZIndex={1000} />
    </section>
  )
}
