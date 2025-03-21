import { create } from 'zustand'

interface SettingsStoreProps{
    error: string | null
    showError: boolean
    setError: (error: string) => void
    clearError: () => void
}


export const settingsStore = create<SettingsStoreProps>((set) => ({
  error: null,
  showError: false,

  setError: (error: string) => set(() => ({ error, showError: true })),
  clearError: () => set(() => ({ error: null, showError: false }))
}))
