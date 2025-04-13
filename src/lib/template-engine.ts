import fs from 'fs'
import path from 'path'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderTemplate (templateName: string, data: any): string {
  const templatePath = path.join(process.cwd(), 'src', 'lib', 'templates', `${templateName}.html`)
  let html = fs.readFileSync(templatePath, 'utf-8')

  // Asegurar encoding UTF-8
  html = html.replace('<head>', '<head><meta charset="UTF-8">')

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

  const generateCheckbox = (checked: boolean) => {
    const uncheckedImg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTMiIGhlaWdodD0iMTMiIHg9IjAuNSIgeT0iMC41IiByeD0iMiIgZmlsbD0id2hpdGUiIHN0cm9rZT0iYmxhY2siLz48L3N2Zz4='
    const checkedImg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTMiIGhlaWdodD0iMTMiIHg9IjAuNSIgeT0iMC41IiByeD0iMiIgZmlsbD0id2hpdGUiIHN0cm9rZT0iYmxhY2siLz48cGF0aCBkPSJNMyA3TDUuNSA5LjVMMTEgNCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4='

    return `<img src="${checked ? checkedImg : uncheckedImg}" 
          style="vertical-align: middle; margin-right: 6px;" 
          width="14" 
          height="14" />`
  }

  // Reemplaza todos los checkboxes
  Object.keys(data.elementosIngreso).forEach(key => {
    const pattern = new RegExp(`<!-- CHECKBOX:${key} -->`, 'g')
    html = html.replace(pattern, generateCheckbox(data.elementosIngreso[key]))
  })

  return html
}
