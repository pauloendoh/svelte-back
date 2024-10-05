import { initContract } from '@ts-rest/core';
import { createInsertSchema } from 'drizzle-zod';
import { d } from 'src/database/drizzle/d';
import { z } from 'zod';

const c = initContract();

const createUserSchema = createInsertSchema(d.users);

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export const userContract = c.router({
  createUser: {
    summary: 'Create user',
    method: 'POST',
    path: '/users',
    responses: {
      201: userSchema,
    },
    body: createUserSchema,
  },
  getAllUsers: {
    summary: 'Get all users',
    method: 'GET',
    path: '/users',
    responses: {
      200: z.array(userSchema),
    },
  },
});
