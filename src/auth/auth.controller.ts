import { Controller } from '@nestjs/common'
import { ServerInferResponses } from '@ts-rest/core'
import {
  nestControllerContract,
  NestRequestShapes,
  TsRest,
  TsRestRequest,
} from '@ts-rest/nest'
import { authC } from './auth.c'
import { SignUpHandler } from './handlers/sign-up/sign-up.handler'

const c = nestControllerContract(authC)

type ReqShape = NestRequestShapes<typeof c>

type SignUpResponse = ServerInferResponses<typeof authC.signUp>

@Controller()
export class AuthController {
  constructor(private readonly signUpHandler: SignUpHandler) {}

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
}
