import { ServerInferResponses } from '@ts-rest/core'
import {
  nestControllerContract,
  NestRequestShapes,
  TsRest,
  TsRestRequest,
} from '@ts-rest/nest'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { contract } from 'src/contract'
import { UserDb } from 'src/database/drizzle/drizzle.tables.schemas'
import { MyController } from 'src/utils/decorators/my-controller'
import { TodoErrorMessage } from './enums/todo-error.message'
import { DeleteTodoHandler } from './handler/delete-todo/delete-todo.handler'
import { UpdateTodoHandler } from './handler/update-todo/update-todo.handler'
import { TodoRepository } from './todo.repository'

const c = nestControllerContract(contract.todos)

type ReqShape = NestRequestShapes<typeof c>

type GetUserTodos = ServerInferResponses<typeof c.getUserTodos>

@MyController()
export class TodoController {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly updateTodoHandler: UpdateTodoHandler,
    private readonly deleteTodoHandler: DeleteTodoHandler,
  ) {}

  @TsRest(c.getUserTodos)
  async getUserTodos(
    @CurrentUser()
    user: UserDb,
  ): Promise<GetUserTodos> {
    const todos = await this.todoRepository.getUserTodos(user.id)
    return {
      status: 200,
      body: todos,
    }
  }

  @TsRest(c.createTodo)
  async createTodo(
    @CurrentUser()
    user: UserDb,
    @TsRestRequest() { body }: ReqShape['createTodo'],
  ): Promise<ServerInferResponses<typeof c.createTodo>> {
    const createdTodo = await this.todoRepository.createTodo({
      description: body.description,
      userId: user.id,
    })

    return {
      status: 201,
      body: createdTodo,
    }
  }

  @TsRest(c.updateTodo)
  async updateTodo(
    @CurrentUser()
    requester: UserDb,
    @TsRestRequest() { body, params }: ReqShape['updateTodo'],
  ): Promise<ServerInferResponses<typeof c.updateTodo>> {
    const result = await this.updateTodoHandler.try({
      data: body,
      requesterId: requester.id,
      todoId: params.todoId,
    })

    if (result.isErr()) {
      if (result.error === TodoErrorMessage.TODO_NOT_FOUND) {
        return {
          status: 404,
          body: result.error,
        }
      }

      return {
        status: 403,
        body: result.error,
      }
    }

    return {
      status: 200,
      body: result.value,
    }
  }

  @TsRest(c.deleteTodo)
  async deleteTodo(
    @CurrentUser()
    requester: UserDb,
    @TsRestRequest() { params }: ReqShape['deleteTodo'],
  ): Promise<ServerInferResponses<typeof c.deleteTodo>> {
    const result = await this.deleteTodoHandler.try({
      requesterId: requester.id,
      todoId: params.todoId,
    })

    if (result.isErr()) {
      if (result.error === TodoErrorMessage.TODO_NOT_FOUND) {
        return {
          status: 404,
          body: result.error,
        }
      }

      return {
        status: 403,
        body: result.error,
      }
    }

    return {
      status: 204,
      body: result.value,
    }
  }
}
