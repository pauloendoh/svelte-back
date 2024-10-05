import { z, ZodObject, ZodRawShape, ZodString } from 'zod'

export const trimStringsInSchema = <T extends ZodObject<any>>(schema: T): T => {
  const shape = schema.shape
  const newShape: ZodRawShape = {}

  for (const key in shape) {
    const field = shape[key]

    if (field instanceof ZodString) {
      newShape[key] = field.trim() // Apply trim to all string fields
    } else {
      newShape[key] = field
    }
  }

  return z.object(newShape) as T
}
