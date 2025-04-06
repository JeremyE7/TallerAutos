import { string } from 'zod'
import { create } from 'zustand'

interface SettingsStoreProps{
    error: string | null
    showError: boolean
    setError: (error: string) => void
    clearError: () => void
    clientKey: string 
    getServerSettings: () => {key: string}
    setServerSettings: (key: string) => void
}


export const settingsStore = create<SettingsStoreProps>((set) => ({
  error: null,
  showError: false,
  clientKey: '',

  setError: (error: string) => {
    console.log('Setting error:', error);
    set(() => ({ error, showError: true }));
  },
  clearError: () => {
    console.log('Clearing error');
    set(() => ({ error: null, showError: false }));
  },
  getServerSettings: () => {
    const key = string().parse(settingsStore.getState().clientKey);
    return { key };
  },
  setServerSettings: (key: string) => {
    console.log('Setting server settings:xd', { key });
    set(() => ({ clientKey: key }));
  },
}));
