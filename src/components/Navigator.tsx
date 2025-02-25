'use client'

import { MenuItem } from 'primereact/menuitem'
import { SpeedDial } from 'primereact/speeddial'
import { useRouter } from 'next/navigation'

export const Navigator = () => {
  const router = useRouter()

  const items: MenuItem[] = [
    {
      icon: 'pi pi-calendar',
      command: () => {
        router.push('/calendary')
      }
    },
    {
      icon: 'pi pi-book',
      command: () => {
        router.push('/')
      }
    },
    {
      icon: 'pi pi-address-book',
      command: () => {
        router.push('/clients')
      }
    },
    {
      icon: 'pi pi-car',
      command: () => {
        router.push('/cars')
      }
    },
    {
      icon: 'pi pi-cog',
      command: () => {
        router.push('/settings')
      }
    }
  ]

  return (
    <SpeedDial model={items} direction="up" style={{ left: '20px', bottom: '20px', position: 'fixed' }} className="speeddial-bottom-left" showIcon="pi pi-bars" hideIcon="pi pi-times"/>
  )
}
