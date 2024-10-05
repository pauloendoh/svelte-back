import { Controller, Inject } from '@nestjs/common';
import { ServerInferResponses } from '@ts-rest/core';
import {
  nestControllerContract,
  NestRequestShapes,
  TsRest,
  TsRestRequest,
} from '@ts-rest/nest';
import { DbProvider, IDbProvider } from 'src/database/database.module';
import { d } from 'src/database/drizzle/d';
import { userContract } from './user.contract';

const c = nestControllerContract(userContract);

type RequestShapes = NestRequestShapes<typeof c>;

type CreateUserResponse = ServerInferResponses<typeof userContract.createUser>;
type GetAllUsersResponse = ServerInferResponses<
  typeof userContract.getAllUsers
>;

@Controller()
export class UserController {
  constructor(
    @Inject(DbProvider)
    private readonly db: IDbProvider,
  ) {}

  @TsRest(c.createUser)
  async createUser(
    @TsRestRequest() { body }: RequestShapes['createUser'],
  ): Promise<CreateUserResponse> {
    const [user] = await this.db.insert(d.users).values(body).returning();

    return {
      body: user,
      status: 201,
    };
  }

  @TsRest(c.getAllUsers)
  async getAllUsers(): Promise<GetAllUsersResponse> {
    const users = await this.db.query.users.findMany();

    return {
      body: users,
      status: 200,
    };
  }
}
