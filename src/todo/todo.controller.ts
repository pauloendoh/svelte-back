import { ServerInferResponses } from '@ts-rest/core'
import {
  nestControllerContract,
  NestRequestShapes,
  TsRest,
  TsRestRequest,
} from '@ts-rest/nest'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { UserDb } from 'src/database/drizzle/drizzle.tables.schemas'
import { MyController } from 'src/utils/decorators/my-controller'
import { TodoErrorMessage } from './enums/todo-error.message'
import { UpdateTodoHandler } from './handler/update-todo/update-todo.handler'
import { todoC } from './todo.c'
import { TodoRepository } from './todo.repository'

const c = nestControllerContract(todoC)

type ReqShape = NestRequestShapes<typeof c>

type GetUserTodos = ServerInferResponses<typeof todoC.getUserTodos>

@MyController()
export class TodoController {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly updateTodoHandler: UpdateTodoHandler,
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
  ): Promise<ServerInferResponses<typeof todoC.createTodo>> {
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
  ): Promise<ServerInferResponses<typeof todoC.updateTodo>> {
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
}
