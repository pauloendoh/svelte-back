import {
  ArgumentMetadata,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common'
import { GetUserByJwtHandler } from '../handlers/get-user-by-jwt/get-user-by-jwt.handler'

// https://stackoverflow.com/a/67455016/27662253

@Injectable()
export class ParseTokenPipe implements PipeTransform {
  constructor(private readonly getUserByJwtHandler: GetUserByJwtHandler) {}

  async transform(
    input: {
      token?: string
      required: boolean
    },
    metadata: ArgumentMetadata,
  ) {
    if (!input.token) {
      if (input.required) {
        throw new UnauthorizedException('Missing authorization token')
      }
      return null
    }

    const user = await this.getUserByJwtHandler.exec(input.token)

    if (user) {
      return user
    }

    if (input.required) {
      throw new UnauthorizedException('Invalid token')
    }

    return null
  }
}

const GetToken = createParamDecorator(
  (
    input: {
      required: boolean
    },
    ctx: ExecutionContext,
  ) => {
    const headers = ctx.switchToHttp().getRequest().headers
    const authorization = String(headers.authorization ?? '')

    return {
      token: authorization.replace('Bearer ', ''),
      required: input.required,
    }
  },
)

export const CurrentUser = (additionalOptions?: { required: boolean }) =>
  GetToken(
    additionalOptions ?? {
      required: false,
    },
    ParseTokenPipe,
  )
