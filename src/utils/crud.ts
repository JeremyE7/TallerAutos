import { db } from '@/db'
import { createApiResponse } from '@/lib/api'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { ZodSchema } from 'zod'

/**
 * Generic GET handler for retrieving a single item by ID
 */
export async function getById<T> (
  table: T,
  id: number,
  notFoundMessage = 'Item not found',
  successMessage = 'Item found',
  errorMessage = 'Error fetching item'
) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await db.select().from(table as any).where(eq((table as any).id, id))

    if (!result || result.length === 0) {
      return NextResponse.json(
        createApiResponse(notFoundMessage, 404)
      )
    }

    return NextResponse.json(
      createApiResponse(successMessage, 200, result)
    )
  } catch (error) {
    console.error('Error fetching item:', error)
    return NextResponse.json(
      createApiResponse(errorMessage, 500)
    )
  }
}

/**
 * Generic GET handler for retrieving items by a foreign key field
 */
export async function getByField<T> (
  table: T,
  field: unknown,
  value: number | string,
  notFoundMessage = 'Items not found',
  successMessage = 'Items found',
  errorMessage = 'Error fetching items'
) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await db.select().from(table as any).where(eq(field as any, value))

    if (!result || result.length === 0) {
      return NextResponse.json(
        createApiResponse(notFoundMessage, 404)
      )
    }

    return NextResponse.json(
      createApiResponse(successMessage, 200, result)
    )
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      createApiResponse(errorMessage, 500)
    )
  }
}

/**
 * Generic PUT handler for updating an item by ID
 */
export async function updateById<T> (
  table: T,
  id: number,
  body: Record<string, unknown>,
  schema?: ZodSchema,
  successMessage = 'Item updated',
  errorMessage = 'Error updating item'
) {
  try {
    let dataToUpdate = body
    // Validate body if schema provided
    if (schema) {
      const validatedBody = schema.safeParse(body)
      if (!validatedBody.success) {
        return NextResponse.json(
          createApiResponse(validatedBody.error.errors.at(-1)?.message ?? 'Validation error', 400)
        )
      }
      dataToUpdate = validatedBody.data as Record<string, unknown>
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await db.update(table as any).set(dataToUpdate).where(eq((table as any).id, id)).returning()

    return NextResponse.json(
      createApiResponse(successMessage, 200, result)
    )
  } catch (error) {
    console.error('Error updating item:', error)

    // Handle specific database errors
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        createApiResponse(errorMessage, 400)
      )
    }

    return NextResponse.json(
      createApiResponse(errorMessage, 500)
    )
  }
}

/**
 * Generic DELETE handler for deleting an item by ID
 */
export async function deleteById<T> (
  table: T,
  id: number,
  successMessage = 'Item deleted',
  errorMessage = 'Error deleting item'
) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await db.delete(table as any).where(eq((table as any).id, id))

    return NextResponse.json(
      createApiResponse(`${successMessage} ${id}`, 200, result)
    )
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      createApiResponse(errorMessage, 500)
    )
  }
}

/**
 * Helper to handle validation errors
 */
export function handleValidationError (error: unknown): NextResponse {
  if (error && typeof error === 'object' && 'errors' in error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const zodError = error as any
    return NextResponse.json(
      createApiResponse(zodError.errors?.at(-1)?.message ?? 'Validation error', 400)
    )
  }
  return NextResponse.json(
    createApiResponse('Validation error', 400)
  )
}

/**
 * Wrapper for error handling in async route handlers
 */
export function withErrorHandler (
  handler: (...args: unknown[]) => Promise<NextResponse>,
  errorMessage = 'Internal server error. Please try again later.'
) {
  return async (...args: unknown[]): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      console.error('Error in handler:', error)
      return NextResponse.json(
        createApiResponse(errorMessage, 500)
      )
    }
  }
}

/**
 * Validate request body with a Zod schema
 */
export function validateRequestBody<T> (
  body: unknown,
  schema: ZodSchema<T>
): { success: true; data: T } | { success: false; response: NextResponse } {
  const result = schema.safeParse(body)
  if (!result.success) {
    return {
      success: false,
      response: NextResponse.json(
        createApiResponse(result.error.errors.at(-1)?.message ?? 'Validation error', 400)
      )
    }
  }
  return { success: true, data: result.data }
}
