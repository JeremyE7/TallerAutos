export const formatText = (text: string) => {
  return text
    .replace(/_/g, ' ') // Reemplaza guiones bajos con espacios
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Separa palabras unidas tipo CamelCase
    .replace(/\b\w/g, char => char.toUpperCase()) // Capitaliza cada palabra
}
