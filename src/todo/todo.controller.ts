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
import { todoC } from './todo.c'
import { TodoRepository } from './todo.repository'

const c = nestControllerContract(todoC)

type ReqShape = NestRequestShapes<typeof c>

type GetUserTodos = ServerInferResponses<typeof todoC.getUserTodos>

@MyController()
export class TodoController {
  constructor(private readonly todoRepository: TodoRepository) {}

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
    const todo = await this.todoRepository.createTodo({
      description: body.description,
      userId: user.id,
    })

    return {
      status: 201,
      body: todo,
    }
  }
}
