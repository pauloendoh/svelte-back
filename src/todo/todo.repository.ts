import { Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { DbWrapper } from 'src/database/db-wrapper'
import { d } from 'src/database/drizzle/d'

@Injectable()
export class TodoRepository {
  constructor(private readonly dbWrapper: DbWrapper) {}

  async getUserTodos(userId: number) {
    const todos = await this.dbWrapper.db.query.todos.findMany({
      where: (todos, { eq }) => eq(todos.userId, userId),
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

  async getTodoById(id: number) {
    const todo = await this.dbWrapper.db.query.todos.findFirst({
      where: (todos, { eq }) => eq(todos.id, id),
    })

    return todo
  }
  async updateTodo(
    id: number,
    input: { description?: string; doneAt?: Date | null },
  ) {
    const [todo] = await this.dbWrapper.db
      .update(d.todos)
      .set({
        doneAt: input.doneAt,
        description: input.description,
      })
      .where(eq(d.todos.id, id))
      .returning()

    return todo
  }

  async deleteTodo(todoId: number) {
    const [todo] = await this.dbWrapper.db
      .delete(d.todos)
      .where(eq(d.todos.id, todoId))
      .returning()
    return todo
  }
}
