import { z } from 'zod'

export const updateTodoDataSchema = z.object({
  description: z.string().optional(),
  doneAt: z.string().datetime().nullable(),
})

export type UpdateTodoData = z.infer<typeof updateTodoDataSchema>
