import { extendZodWithOpenApi } from '@anatine/zod-openapi'
import { initContract } from '@ts-rest/core'
import { dbZod } from 'src/database/drizzle/db.zod'
import { applyRequiredUserMetadata } from 'src/utils/types/ts-rest/apply-required-user-metadata'
import { z } from 'zod'
import { TodoErrorMessage } from './enums/todo-error.message'
import { updateTodoDataSchema } from './handler/update-todo/update-todo.data'
const c = initContract()

extendZodWithOpenApi(z)

export const todoC = c.router({
  getUserTodos: applyRequiredUserMetadata({
    summary: 'Get user todos',
    method: 'GET',
    path: '/todos',
    responses: {
      200: z.array(dbZod.todo.selectSchema),
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
      200: dbZod.todo.selectSchema,
    },
  }),
  updateTodo: applyRequiredUserMetadata({
    summary: 'Update todo',
    method: 'PATCH',
    path: '/todos/:todoId',
    pathParams: z.object({
      todoId: z.coerce.number(),
    }),
    body: updateTodoDataSchema,
    responses: {
      200: dbZod.todo.selectSchema,
      403: z.literal(TodoErrorMessage.NOT_AUTHORIZED),
      404: z.literal(TodoErrorMessage.TODO_NOT_FOUND),
    },
  }),
  deleteTodo: applyRequiredUserMetadata({
    summary: 'Delete todo',
    method: 'DELETE',
    path: '/todos/:todoId',
    pathParams: z.object({
      todoId: z.coerce.number(),
    }),
    responses: {
      204: dbZod.todo.selectSchema,
      403: z.literal(TodoErrorMessage.NOT_AUTHORIZED),
      404: z.literal(TodoErrorMessage.TODO_NOT_FOUND),
    },
  }),
})
