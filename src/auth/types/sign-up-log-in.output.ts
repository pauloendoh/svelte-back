import { z } from 'zod'

export const signUpLogInOutputSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  token: z.string(),
  tokenExpiresAt: z.string().date(),
})

export type SignUpLogInOutput = z.infer<typeof signUpLogInOutputSchema>
