/**
 * model User {
  id        String    @id @default(cuid())
  deletedAt DateTime?

  googleId String? @unique
  username String  @unique
  email    String  @unique
  password String
  isAdmin  Boolean @default(false)

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  expiresAt DateTime?
  
 */

import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
});
