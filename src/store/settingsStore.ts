import { string } from 'zod'
import { create } from 'zustand'

interface SettingsStoreProps{
    error: string | null
    setError: (error: string) => void
    clearMessages: () => void
    clientKey: string
    getServerSettings: () => {key: string}
    setServerSettings: (key: string) => void
    success: string | null
    setSuccess: (success: string) => void
}


export const settingsStore = create<SettingsStoreProps>((set) => ({
  error: null,
  clientKey: '',
  success: null,
  setSuccess: (success: string) => {
    console.trace('Setting success:', success)
    set(() => ({ success, showSuccess: true }))
  },
  setError: (error: string) => {
    console.trace('Setting error:', error)
    set(() => ({ error, showError: true }))
  },
  clearMessages: () => {
    console.trace('Clearing error')
    set(() => ({ error: null, success: null }))
  },
  getServerSettings: () => {
    const key = string().parse(settingsStore.getState().clientKey)
    return { key }
  },
  setServerSettings: (key: string) => {
    console.log('Setting server settings:xd', { key })
    set(() => ({ clientKey: key }))
  }
}))
