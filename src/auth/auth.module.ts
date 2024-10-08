import { Module } from '@nestjs/common'
import { UserModule } from 'src/user/user.module'
import { AuthController } from './auth.controller'
import { ParseTokenPipe } from './decorators/current-user.decorator'
import { GetUserByJwtHandler } from './handlers/get-user-by-jwt/get-user-by-jwt.handler'
import { HashPasswordHandler } from './handlers/hash-password/hash-password-handler'
import { SignInHandler } from './handlers/sign-in/sign-in.handler'
import { SignUpHandler } from './handlers/sign-up/sign-up.handler'
import { SignUserJwtHandler } from './handlers/sign-user-jwt/sign-user-jwt.handler'

const handlers = [
  SignUpHandler,
  SignUserJwtHandler,
  SignInHandler,
  HashPasswordHandler,
]

@Module({
  controllers: [AuthController],
  providers: [...handlers, GetUserByJwtHandler, ParseTokenPipe],
  imports: [UserModule],
  exports: [ParseTokenPipe, GetUserByJwtHandler],
})
export class AuthModule {}
