import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import { SignUp409ErrorMessage } from './handlers/sign-up/sign-up.handler'
import { signUpInputSchema } from './handlers/sign-up/sign-up.input'
import { signUpOutputSchema } from './handlers/sign-up/sign-up.output'

const c = initContract()

export const authC = c.router({
  signUp: {
    summary: 'Create user account',
    method: 'POST',
    path: '/sign-up',
    responses: {
      201: signUpOutputSchema,
      409: z.nativeEnum(SignUp409ErrorMessage),
    },
    body: signUpInputSchema,
  },
})
