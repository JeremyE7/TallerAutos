import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      'semi': ['error', 'never'],                // Sin punto y coma
      'quotes': ['error', 'single'],             // Comillas simples
      'comma-dangle': ['error', 'never'],        // Sin coma al final
      'space-before-function-paren': ['error', 'always'], // Espacio antes de paréntesis en funciones
      'indent': ['error', 2],                    // Indentación de 2 espacios
      'no-trailing-spaces': 'error',             // Sin espacios al final de líneas
      'eol-last': ['error', 'always']            // Línea en blanco al final
    }
  }
]

export default eslintConfig
