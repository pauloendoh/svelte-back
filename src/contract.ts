import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { userContract } from './user/user.contract';

const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
});

export type Post = z.infer<typeof PostSchema>;

const c = initContract();

export const postContract = c.router({
  createPost: {
    method: 'POST',
    path: '/posts',
    responses: {
      201: PostSchema,
    },
    body: z.object({
      title: z.string(),
      body: z.string(),
    }),
    summary: 'Create a post',
  },
  getPost: {
    method: 'GET',
    path: `/posts/:id`,
    responses: {
      200: PostSchema,
      404: z.null(),
    },
    summary: 'Get a post by id',
  },
  getAllPosts: {
    method: 'GET',
    path: '/posts',
    responses: {
      200: z.array(PostSchema),
    },
  },
});

export const contract = c.router({
  posts: postContract,
  users: userContract,
});
