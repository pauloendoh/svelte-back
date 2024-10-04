import { Controller, Get } from '@nestjs/common';
import { ServerInferResponses } from '@ts-rest/core';
import {
  nestControllerContract,
  NestRequestShapes,
  TsRest,
  TsRestRequest,
} from '@ts-rest/nest';
import { AppService } from './app.service';
import { Post, postContract } from './contract';

const c = nestControllerContract(postContract);
type RequestShapes = NestRequestShapes<typeof c>;

type GetPostResponse = ServerInferResponses<typeof postContract.getPost>;
type CreatePostResponse = ServerInferResponses<typeof postContract.createPost>;

@Controller()
export class AppController {
  private readonly posts: Post[] = [];

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @TsRest(c.getPost)
  async getPost(
    @TsRestRequest() { params: { id } }: RequestShapes['getPost'],
  ): Promise<GetPostResponse> {
    const post = this.posts.find((p) => p.id === id);

    if (!post) {
      return { status: 404, body: null };
    }

    return { status: 200 as const, body: post };
  }

  @TsRest(c.getAllPosts)
  async getAllPosts(): Promise<Post[]> {
    return this.posts;
  }

  @TsRest(c.createPost)
  async createPost(
    @TsRestRequest() { body }: RequestShapes['createPost'],
  ): Promise<CreatePostResponse> {
    const post = {
      id: Math.random().toString(36).slice(2),
      ...body,
    };
    this.posts.push(post);

    return {
      body: post,
      status: 201,
    };
  }
}
