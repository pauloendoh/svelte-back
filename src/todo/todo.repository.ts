import { Injectable } from '@nestjs/common'
import { DbWrapper } from 'src/database/db-wrapper'
import { d } from 'src/database/drizzle/d'

@Injectable()
export class TodoRepository {
  constructor(private readonly dbWrapper: DbWrapper) {}

  async getUserTodos(userId: number) {
    const todos = await this.dbWrapper.db.query.todos.findMany({
      where: (users, { eq }) => eq(users.id, userId),
    })

    return todos
  }

  async createTodo(input: { description: string; userId: number }) {
    const [todo] = await this.dbWrapper.db
      .insert(d.todos)
      .values({
        description: input.description,
        userId: input.userId,
      })
      .returning()

    return todo
  }
}
