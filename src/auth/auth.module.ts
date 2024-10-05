import { Module } from '@nestjs/common'
import { UserModule } from 'src/user/user.module'
import { AuthController } from './auth.controller'
import { SignUpHandler } from './handlers/sign-up/sign-up.handler'

@Module({
  controllers: [AuthController],
  providers: [SignUpHandler],
  imports: [UserModule],
})
export class AuthModule {}
