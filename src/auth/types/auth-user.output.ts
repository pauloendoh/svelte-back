import { z } from 'zod'

export const authUserOutputSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  token: z.string(),
  tokenExpiresAt: z.string().date(),
})

export type AuthUserOutput = z.infer<typeof authUserOutputSchema>
