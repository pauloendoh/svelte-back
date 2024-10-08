import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { d } from './d'

export const dbZod = {
  users: {
    insertSchema: createInsertSchema(d.users),
  },
  todos: {
    selectSchema: createSelectSchema(d.todos),
  },
}
