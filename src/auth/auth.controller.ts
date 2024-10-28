import { ServerInferResponses } from '@ts-rest/core'
import {
  nestControllerContract,
  NestRequestShapes,
  TsRest,
  TsRestRequest,
} from '@ts-rest/nest'
import { UserDb } from 'src/database/drizzle/drizzle.tables.schemas'
import { MyController } from 'src/utils/decorators/my-controller'
import { authC } from './auth.c'
import { CurrentUser } from './decorators/current-user.decorator'
import { LogInHandler } from './handlers/log-in/log-in.handler'
import { SignUpHandler } from './handlers/sign-up/sign-up.handler'
import { SignUserJwtHandler } from './handlers/sign-user-jwt/sign-user-jwt.handler'

const c = nestControllerContract(authC)

type ReqShape = NestRequestShapes<typeof c>

type SignUpResponse = ServerInferResponses<typeof authC.signUp>
type GetMeResponse = ServerInferResponses<typeof authC.getMe>
type LogInResponse = ServerInferResponses<typeof authC.logIn>

@MyController()
export class AuthController {
  constructor(
    private readonly signUpHandler: SignUpHandler,
    private readonly signUserJwt: SignUserJwtHandler,
    private readonly logInHandler: LogInHandler,
  ) {}

  @TsRest(c.signUp)
  async signUp(
    @TsRestRequest() { body }: ReqShape['signUp'],
  ): Promise<SignUpResponse> {
    const result = await this.signUpHandler.try(body)

    if (result.isErr()) {
      return {
        body: result.error,
        status: 409,
      }
    }

    return {
      body: result.value,
      status: 201,
    }
  }

  @TsRest(c.logIn)
  async logIn(
    @TsRestRequest() { body }: ReqShape['logIn'],
  ): Promise<LogInResponse> {
    const result = await this.logInHandler.try(body)

    if (result.isErr()) {
      return {
        status: 400,
        body: result.error,
      }
    }

    return {
      status: 200,
      body: result.value,
    }
  }

  @TsRest(c.getMe)
  async getMe(
    @CurrentUser({
      required: true,
    })
    user: UserDb,
  ): Promise<GetMeResponse> {
    const { token, tokenExpiresAt } = this.signUserJwt.exec({
      userId: user.id,
    })

    return {
      status: 200,
      body: {
        email: user.email,
        id: user.id,
        username: user.username,
        token: token,
        tokenExpiresAt: tokenExpiresAt,
      },
    }
  }
}
