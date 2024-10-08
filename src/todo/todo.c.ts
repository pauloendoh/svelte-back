import { extendZodWithOpenApi } from '@anatine/zod-openapi'
import { initContract } from '@ts-rest/core'
import { dbZod } from 'src/database/drizzle/db.zod'
import { applyRequiredUserMetadata } from 'src/utils/types/ts-rest/apply-required-user-metadata'
import { z } from 'zod'
const c = initContract()

extendZodWithOpenApi(z)

export const todoC = c.router({
  getUserTodos: applyRequiredUserMetadata({
    summary: 'Get user todos',
    method: 'GET',
    path: '/todos',
    responses: {
      200: z.array(dbZod.todos.selectSchema),
    },
  }),

  createTodo: applyRequiredUserMetadata({
    summary: 'Create todo',
    method: 'POST',
    path: '/todos',
    body: z.object({
      description: z.string(),
    }),
    responses: {
      200: dbZod.todos.selectSchema,
    },
  }),
})
