import { settingsStore } from "@/store/settingsStore"
import { useEffect } from "react"

export const useSettings = () => {
    const {getServerSettings, setServerSettings,clientKey} = settingsStore()

    useEffect(() => {        
        if(!clientKey){            
            const localStorageKey = localStorage.getItem('clientKey')            
            if(localStorageKey){
                setServerSettings(localStorageKey )
            }
        } 
    },[])

    const saveSettings = (key: string) => {
        localStorage.setItem('clientKey', key)
        setServerSettings(key)
    }
    return { getServerSettings, saveSettings , clientKey }
}