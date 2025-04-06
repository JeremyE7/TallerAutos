import { settingsStore } from "@/store/settingsStore"
import { useEffect } from "react"

export const useSettings = () => {
    const {getServerSettings, setServerSettings,clientKey} = settingsStore()

    useEffect(() => {        
        if(!clientKey && localStorage.getItem('clientKey')){            
            const localStorageKey = localStorage.getItem('serverKey')            
            if(localStorageKey){
                setServerSettings(localStorageKey )
            }
        } 
    },[])

    useEffect(() => {
        if(clientKey !== localStorage.getItem('clientKey')){
            localStorage.setItem('clientKey', clientKey)
        }
    }, [clientKey])

    return { getServerSettings, setServerSettings, clientKey }
}