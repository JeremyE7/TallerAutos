import { db } from '@/db'
import { NextResponse } from 'next/server'
import { generatePDFFromHTML } from '@/lib/pdf-service'
import { renderTemplate } from '@/lib/template-engine'
import { ElementosIngreso, OrdenTrabajo, Vehiculo, Cliente } from '@/db/schema'
import { eq } from 'drizzle-orm'
import path from 'path'
import fs from 'fs'
import { withHeaderValidation } from '../../../utils'

export const GET = withHeaderValidation(
  async (req: Request, { params }: { params: { id: string } }) => {
    try {
      const { id } = await params

      // Obtener la orden de trabajo
      const orden = await db.select().from(OrdenTrabajo).where(eq(OrdenTrabajo.id, parseInt(id))).get()
      if (!orden) throw new Error('No se encontró la orden')

      // Obtener vehículo y elementos de ingreso
      const [vehiculo, elementosIngreso] = await Promise.all([
        db.select().from(Vehiculo).where(eq(Vehiculo.id, orden.vehiculo_id)).get(),
        db.select().from(ElementosIngreso).where(eq(ElementosIngreso.id, orden.elementos_ingreso_id)).get()
      ])
      if (!vehiculo) throw new Error('No se encontró el vehículo')

      // Obtener cliente
      const cliente = await db.select().from(Cliente).where(eq(Cliente.id, vehiculo.cliente_id)).get()

      // 2. Renderizar plantilla
      const imagePath = path.join(process.cwd(), 'src', 'lib', 'templates', 'encabezado.png');
      const imageBase64 = fs.readFileSync(imagePath, 'base64');

      // QR


      const baseUrl = process.env.BASE_URL || "http://localhost:3000";
      const qrData = `${baseUrl}/?id=${orden.id}`;

      let QRbase64 = await new Promise((resolve, reject) => {
        QRCode.toDataURL(qrData, function (err, code) {
          if (err) {
            reject(reject);
            return;
          }
          resolve(code);
        });
      });

      console.log(QRbase64);
      const html = renderTemplate('orden-', {
        orden,
        vehiculo,
        elementosIngreso,
        cliente,
        headerImage: `data:image/png;base64,${imageBase64}`,
        qrImage: QRbase64,
      });

      // 3. Generar PDF
      const pdfBuffer = await generatePDFFromHTML(html)

      // 4. Devolver respuesta
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=orden-${id}.pdf`
        }
      })

    } catch (error) {
      console.error('Error generando PDF:', error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Error en generación de PDF' },
        { status: 500 }
      )
    }
  }
)
