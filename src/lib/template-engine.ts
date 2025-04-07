import fs from 'fs'
import path from 'path'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderTemplate (templateName: string, data: any): string {
  const templatePath = path.join(process.cwd(), 'src', 'lib', 'templates', `${templateName}.html`)
  let html = fs.readFileSync(templatePath, 'utf-8')

  // Reemplazo simple de variables
  html = html.replace(/\{\{(\w+)(\.\w+)*\}\}/g, (match) => {
    const props = match.slice(2, -2).split('.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return props.reduce((obj: any, key: string) => obj?.[key], data) || ''
  })

  // Soporte para condicionales básicos
  html = html.replace(/\{\{if (.*?)\}\}(.*?)\{\{\/if\}\}/gs, (match, condition, content) => {
    const [varName, value] = condition.split('===').map(s => s.trim())
    return data[varName] === value ? content : ''
  })
  // Función para generar el HTML del checkbox
  const generateCheckbox = (checked: boolean) =>
    `<span style="
    display: inline-block;
    margin-right: 6px;
    font-size: 14px;
    color: #333;
  ">${checked ? '☑' : '☐'}</span>`
  // Reemplaza todos los checkboxes
  Object.keys(data.elementosIngreso).forEach(key => {
    const pattern = new RegExp(`<!-- CHECKBOX:${key} -->`, 'g')
    html = html.replace(pattern, generateCheckbox(data.elementosIngreso[key]))
  })
  return html
}
