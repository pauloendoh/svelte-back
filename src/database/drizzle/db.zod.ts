import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { d } from './d'

export const dbZod = {
  user: {
    insertSchema: createInsertSchema(d.users),
  },
  todo: {
    selectSchema: createSelectSchema(d.todos),
    insertSchema: createInsertSchema(d.todos),
  },
}
