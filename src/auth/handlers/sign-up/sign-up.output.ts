import { z } from 'zod'

export const signUpOutputSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
})

export type SignUpOutput = z.infer<typeof signUpOutputSchema>
