import { InferType } from 'src/utils/types/zod/infer-type'
import { z } from 'zod'

export const signUpInputSchema = z
  .object({
    username: z.string().trim().min(3).max(16),
    email: z.string().trim().email(),
    password1: z.string().min(6),
    password2: z.string().min(6),
  })
  .refine((dto) => dto.password1 === dto.password2, {
    message: "Passwords don't match",
  })

export type SignUpInput = InferType<typeof signUpInputSchema>
