import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  salt: text('salt').notNull(),

  createdAt: timestamp('created_at', {
    mode: 'date',
    precision: 3,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export type UserDb = typeof users.$inferSelect

export const usersRelations = relations(users, ({ many }) => ({
  todos: many(todos),
}))

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),

  description: text('description').notNull(),
  doneAt: timestamp('done_at', { mode: 'date', precision: 3 }),

  createdAt: timestamp('created_at', {
    mode: 'date',
    precision: 3,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
}))
