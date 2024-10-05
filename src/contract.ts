import { initContract } from '@ts-rest/core'
import { authC } from './auth/auth.c'
import { userC } from './user/user.c'

const c = initContract()

export const contract = c.router({
  users: userC,
  auth: authC,
})
