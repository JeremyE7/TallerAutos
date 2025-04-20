import { ElementosIngreso, Response } from '@/app/types'
import { encryptText, formatText } from './general'
import { settingsStore } from '@/store/settingsStore'
import { z } from 'zod'

export interface ElementoIngresoSelectItem {
  name: string
  code: string
  label: string
}

export const elementosIngresoSchema = z.object({
  limpiaparabrisas: z.boolean({
    required_error: 'El limpiaparabrisas es obligatorio.',
    invalid_type_error: 'El limpiaparabrisas debe ser un valor booleano.'
  }).optional(),
  espejos: z.boolean({
    required_error: 'Los espejos son obligatorios.',
    invalid_type_error: 'Los espejos deben ser un valor booleano.'
  }).optional(),
  luces: z.boolean({
    required_error: 'Las luces son obligatorias.',
    invalid_type_error: 'Las luces deben ser un valor booleano.'
  }).optional(),
  placas: z.boolean({
    required_error: 'Las placas son obligatorias.',
    invalid_type_error: 'Las placas deben ser un valor booleano.'
  }).optional(),
  emblemas: z.boolean({
    required_error: 'Los emblemas son obligatorios.',
    invalid_type_error: 'Los emblemas deben ser un valor booleano.'
  }).optional(),
  radio: z.boolean({
    required_error: 'El radio es obligatorio.',
    invalid_type_error: 'El radio debe ser un valor booleano.'
  }).optional(),
  control_alarma: z.boolean({
    required_error: 'El control de alarma es obligatorio.',
    invalid_type_error: 'El control de alarma debe ser un valor booleano.'
  }).optional(),
  tapetes: z.boolean({
    required_error: 'Los tapetes son obligatorios.',
    invalid_type_error: 'Los tapetes deben ser un valor booleano.'
  }).optional(),
  aire_acondicionado: z.boolean({
    required_error: 'El aire acondicionado es obligatorio.',
    invalid_type_error: 'El aire acondicionado debe ser un valor booleano.'
  }).optional(),
  matricula: z.boolean({
    required_error: 'La matrícula es obligatoria.',
    invalid_type_error: 'La matrícula debe ser un valor booleano.'
  }).optional(),
  herramientas: z.boolean({
    required_error: 'Las herramientas son obligatorias.',
    invalid_type_error: 'Las herramientas deben ser un valor booleano.'
  }).optional(),
  tuerca_seguridad: z.boolean({
    required_error: 'La tuerca de seguridad es obligatoria.',
    invalid_type_error: 'La tuerca de seguridad debe ser un valor booleano.'
  }).optional(),
  gata: z.boolean({
    required_error: 'La gata es obligatoria.',
    invalid_type_error: 'La gata debe ser un valor booleano.'
  }).optional(),
  llave_ruedas: z.boolean({
    required_error: 'La llave de ruedas es obligatoria.',
    invalid_type_error: 'La llave de ruedas debe ser un valor booleano.'
  }).optional(),
  extintor: z.boolean({
    required_error: 'El extintor es obligatorio.',
    invalid_type_error: 'El extintor debe ser un valor booleano.'
  }).optional(),
  encendedor: z.boolean({
    required_error: 'El encendedor es obligatorio.',
    invalid_type_error: 'El encendedor debe ser un valor booleano.'
  }).optional(),
  antena: z.boolean({
    required_error: 'La antena es obligatoria.',
    invalid_type_error: 'La antena debe ser un valor booleano.'
  }).optional(),
  llanta_emergencia: z.boolean({
    required_error: 'La llanta de emergencia es obligatoria.',
    invalid_type_error: 'La llanta de emergencia debe ser un valor booleano.'
  }).optional(),
  combustible: z.number({
    required_error: 'El combustible es obligatorio.',
    invalid_type_error: 'El combustible debe ser un número entre 1 y 100.'
  }).min(0).max(100).optional()
})

const { setError } = settingsStore.getState()


export const parseElementosIngreso = (elementosIngreso: ElementosIngreso | null): ElementoIngresoSelectItem[] => {
  if (!elementosIngreso) return []
  const pairs = Object.entries(elementosIngreso)
  return pairs
    .map(([key, value]) => {
      if (key === 'id' || key === 'combustible') return null
      return {
        label: formatText(key),
        name: key,
        code: value
      }
    })
    .filter((item): item is ElementoIngresoSelectItem => item !== null)
}

export const createElementosIngreso = async (elementosIngreso: ElementosIngreso, clientKey: string) => {
  try {
    const response = await fetch('api/elementos_ingreso', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client-key': encryptText(clientKey, 'vinicarJOSEJEREMYXD')
      },
      body: JSON.stringify(elementosIngreso)
    })

    const data: Response<ElementosIngreso> = await response.json()
    if (data.code !== 200) {
      console.error('Error creating elementos de ingreso:', data.message)
      setError(data.message)
      return
    }

    console.info(data.message)
    return data.data
  } catch (error) {
    setError('Error interno del servidor. Por favor intente de nuevo más tarde.')
    console.error('Error creating elementos de ingreso:', error)
  }
}

export const editElementosIngreso = async (id: number, elementosIngreso: ElementosIngreso, clientKey: string) => {
  try {
    const response = await fetch(`api/elementos_ingreso/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'client-key': encryptText(clientKey, 'vinicarJOSEJEREMYXD')
      },
      body: JSON.stringify(elementosIngreso)
    })

    const data: Response<ElementosIngreso> = await response.json()
    if (data.code !== 200) {
      console.error('Error updating elementos de ingreso:', data.message)
      setError(data.message)
      return
    }

    console.info(data.message)
    return data.data

  } catch (error) {
    setError('Error interno del servidor. Por favor intente de nuevo más tarde.')
    console.error('Error updating elementos de ingreso:', error)
  }
}
