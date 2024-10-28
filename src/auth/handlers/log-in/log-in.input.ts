import { InferType } from 'src/utils/types/zod/infer-type'
import { z } from 'zod'

export const logInInputSchema = z.object({
  usernameOrEmail: z.string().trim().min(3).max(16),
  password: z.string().min(6),
})

export type LogInInput = InferType<typeof logInInputSchema>
