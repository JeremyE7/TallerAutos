import { db } from "@/db";
import { NextResponse } from "next/server";
import { createApiResponse } from "@/lib/api";
import { OrdenTrabajo } from '@/db/schema';
import { eq } from 'drizzle-orm';


// obtener una orden por su id de param
export async function GET(req: Request, { params }) {
    try {
        const { id } = await params;
        const orden = await db.select().from(OrdenTrabajo).where(eq(OrdenTrabajo.id, parseInt(id)));
        if (!orden) {
            return NextResponse.json(
                createApiResponse('No order found', 404)
            )
        }
        return NextResponse.json(
            createApiResponse('Orden encontrada', 200, orden)
        )
    } catch (error) {
        console.error('Error fetching order:', error)
        return NextResponse.json(
            createApiResponse('Orden no encontrada', 500)
        )
    }
}

// Actualizar una orden por su id de param
export async function PUT(req: Request, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const orden = await db.update(OrdenTrabajo).set(body).where(eq(OrdenTrabajo.id, parseInt(id)));
        return NextResponse.json(
            createApiResponse('Orden actualizada', 200, orden)
        )
    } catch (error) {
        console.error('Error fetching order:', error)
        return NextResponse.json(
            createApiResponse('Orden no encontrada', 500)
        )
    }
}

// Eliminar una orden por su id de param
export async function DELETE(req: Request, { params }) {
    try {
        const { id } = await params;
        const orden = await db.delete(OrdenTrabajo).where(eq(OrdenTrabajo.id, parseInt(id)));
        return NextResponse.json(
            createApiResponse('Orden ' + id + ' eliminada', 200, orden)
        )
    } catch (error) {
        console.error('Error fetching order:', error)
        return NextResponse.json(
            createApiResponse('Orden no encontrada', 500)
        )
    }
}