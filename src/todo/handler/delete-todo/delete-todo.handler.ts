import { Injectable } from '@nestjs/common'
import { err, ok, ResultAsync } from 'neverthrow'
import { TodoDb } from 'src/database/drizzle/drizzle.tables.schemas'
import { AsyncResultHandler } from 'src/utils/types/my-handlers'
import { TodoErrorMessage } from '../../enums/todo-error.message'
import { TodoRepository } from '../../todo.repository'

@Injectable()
export class DeleteTodoHandler implements AsyncResultHandler {
  constructor(private readonly todoRepository: TodoRepository) {}

  async try(input: {
    requesterId: number
    todoId: number
  }): Promise<ResultAsync<TodoDb, TodoErrorMessage>> {
    const foundTodo = await this.todoRepository.getTodoById(input.todoId)

    if (!foundTodo) {
      return err(TodoErrorMessage.TODO_NOT_FOUND)
    }

    if (foundTodo.userId !== input.requesterId) {
      return err(TodoErrorMessage.NOT_AUTHORIZED)
    }

    const updatedTodo = await this.todoRepository.deleteTodo(input.todoId)

    return ok(updatedTodo)
  }
}
