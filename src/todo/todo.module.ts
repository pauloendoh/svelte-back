import { Module } from '@nestjs/common'
import { AuthModule } from 'src/auth/auth.module'
import { DatabaseModule } from 'src/database/database.module'
import { TodoController } from './todo.controller'
import { TodoRepository } from './todo.repository'

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [TodoController],
  providers: [TodoRepository],
})
export class TodoModule {}
