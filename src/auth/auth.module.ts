import { Module } from '@nestjs/common'
import { UserModule } from 'src/user/user.module'
import { AuthController } from './auth.controller'
import { GetSignInTokenHandler } from './handlers/get-sign-in-token/get-sign-in-token.handler'
import { SignUpHandler } from './handlers/sign-up/sign-up.handler'

@Module({
  controllers: [AuthController],
  providers: [SignUpHandler, GetSignInTokenHandler],
  imports: [UserModule],
})
export class AuthModule {}
