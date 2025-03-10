export const formatText = (text: string) => {
  return text
    .replace(/_/g, ' ') // Reemplaza guiones bajos con espacios
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Separa palabras unidas tipo CamelCase
    .replace(/\b\w/g, char => char.toUpperCase()) // Capitaliza cada palabra
}

/**
 * Comprueba si el número de cédula ingresado es válido.
 * @param  {string | number} ci - Número de cédula
 * @return {boolean} - Retorna `true` si la cédula es válida, `false` en caso contrario.
 */
export function isValidCI (ci: string | number): boolean {
  let isNumeric = true
  let total = 0
  let individual: string

  // Convertir a string para manejar el procesamiento de caracteres
  const ciString = ci.toString()

  for (let position = 0; position < 10; position++) {
    // Obtiene cada posición del número de cédula
    individual = ciString.substring(position, position + 1)

    if (isNaN(Number(individual))) {
      console.log(ci, position, individual, isNaN(Number(individual)))
      isNumeric = false
      break
    } else {
      // Si la posición es menor a 9
      if (position < 9) {
        const num = parseInt(individual, 10)

        // Si la posición es par (0, 2, 4, 6, 8)
        if (position % 2 === 0) {
          const double = num * 2
          total += double > 9 ? 1 + (double % 10) : double
        } else {
          // Si la posición es impar (1, 3, 5, 7)
          total += num
        }
      }
    }
  }

  total = total % 10 !== 0 ? (total - (total % 10) + 10) - total : 0

  if (isNumeric) {
    // La cédula debe contener exactamente 10 dígitos
    if (ciString.length !== 10) {
      return false
    }

    // La cédula no puede ser cero
    if (parseInt(ciString, 10) === 0) {
      return false
    }

    // El total debe ser igual al último número de la cédula
    const lastDigit = parseInt(ciString.charAt(9), 10)
    if (total !== lastDigit) {
      return false
    }

    console.log('Cédula válida:', ci)
    return true
  }

  return false
}
