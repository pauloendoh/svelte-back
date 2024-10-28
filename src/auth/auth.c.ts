import { initContract } from '@ts-rest/core'
import { applyRequiredUserMetadata } from 'src/utils/types/ts-rest/apply-required-user-metadata'
import { z } from 'zod'
import { LogInErroMessage } from './handlers/log-in/log-in.handler'
import { logInInputSchema } from './handlers/log-in/log-in.input'
import { SignUp409ErrorMessage } from './handlers/sign-up/sign-up.handler'
import { signUpInputSchema } from './handlers/sign-up/sign-up.input'
import { authUserOutputSchema } from './types/auth-user.output'

const c = initContract()

export const authC = c.router(
  {
    signUp: {
      method: 'POST',
      summary: 'Create user account',
      path: '/sign-up',
      body: signUpInputSchema,
      headers: z.object({ 'x-custom-header': z.string() }),
      responses: {
        201: authUserOutputSchema,
        409: z.nativeEnum(SignUp409ErrorMessage),
        404: z.enum(['Not found']),
      },
    },
    logIn: {
      method: 'POST',
      summary: 'Log in user',
      path: '/log-in',
      body: logInInputSchema,
      responses: {
        200: authUserOutputSchema,
        400: z.nativeEnum(LogInErroMessage),
      },
    },
    getMe: applyRequiredUserMetadata({
      method: 'GET',
      summary: 'Get current user',
      path: '/me',
      responses: {
        200: authUserOutputSchema,
      },
    }),
  },
  {
    strictStatusCodes: true,
  },
)
