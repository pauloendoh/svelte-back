import { Inject } from '@nestjs/common'
import { ServerInferResponses } from '@ts-rest/core'
import {
  nestControllerContract,
  NestRequestShapes,
  TsRest,
} from '@ts-rest/nest'
import {
  DatabaseProvider,
  IDatabaseProvider,
} from 'src/database/database.module'
import { MyController } from 'src/utils/decorators/my-controller'
import { getAllUsers200ResponseItemSchema, userC } from './user.c'

const c = nestControllerContract(userC)

type RequestShapes = NestRequestShapes<typeof c>

type GetAllUsersResponse = ServerInferResponses<typeof userC.getAllUsers>

@MyController()
export class UserController {
  constructor(
    @Inject(DatabaseProvider)
    private readonly db: IDatabaseProvider,
  ) {}

  @TsRest(c.getAllUsers)
  async getAllUsers(): Promise<GetAllUsersResponse> {
    const users = await this.db.query.users.findMany()

    return {
      body: users.map((user) => getAllUsers200ResponseItemSchema.parse(user)),
      status: 200,
    }
  }
}
