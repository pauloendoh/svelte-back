import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import { SignUp409ErrorMessage } from './handlers/sign-up/sign-up.handler'
import { signUpInputSchema } from './handlers/sign-up/sign-up.input'
import { signUpLogInOutputSchema } from './types/sign-up-log-in.output'

const c = initContract()

export const authC = c.router({
  signUp: {
    method: 'POST',
    summary: 'Create user account',
    path: '/sign-up',
    body: signUpInputSchema,
    responses: {
      201: signUpLogInOutputSchema,
      409: z.nativeEnum(SignUp409ErrorMessage),
      400: z.object({ message: z.string() }),
    },
  },
})
