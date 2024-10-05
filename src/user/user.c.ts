import { extendZodWithOpenApi } from '@anatine/zod-openapi'
import { initContract } from '@ts-rest/core'
import { UserDb } from 'src/database/drizzle/drizzle.tables.schemas'
import { PartialUnknown } from 'src/utils/types/partial-unknown'
import { z } from 'zod'
const c = initContract()

extendZodWithOpenApi(z)

export const getAllUsers200ResponseItemSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
} satisfies PartialUnknown<UserDb>)

export const userC = c.router({
  getAllUsers: {
    summary: 'Get all users',
    method: 'GET',
    path: '/users',
    responses: {
      200: z.array(getAllUsers200ResponseItemSchema),
    },
  },
})
