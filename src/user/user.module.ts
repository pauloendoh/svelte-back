import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database/database.module'
import { UserRepository } from './repository/user.repository'
import { UserController } from './user.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
