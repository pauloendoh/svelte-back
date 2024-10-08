import { Module } from '@nestjs/common'
import { AuthModule } from 'src/auth/auth.module'
import { DatabaseModule } from 'src/database/database.module'
import { DeleteTodoHandler } from './handler/delete-todo/delete-todo.handler'
import { UpdateTodoHandler } from './handler/update-todo/update-todo.handler'
import { TodoController } from './todo.controller'
import { TodoRepository } from './todo.repository'

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [TodoController],
  providers: [TodoRepository, UpdateTodoHandler, DeleteTodoHandler],
})
export class TodoModule {}
