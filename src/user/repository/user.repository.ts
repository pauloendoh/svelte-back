import { Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { DbWrapper } from 'src/database/db-wrapper'
import { d } from 'src/database/drizzle/d'

@Injectable()
export class UserRepository {
  constructor(private readonly dbWrapper: DbWrapper) {}

  async findUserByEmail(email: string) {
    const [user] = await this.dbWrapper.db
      .select()
      .from(d.users)
      .where(eq(d.users.email, email))

    if (!user) {
      return null
    }

    return user
  }

  async findUserByUsername(username: string) {
    const [user] = await this.dbWrapper.db
      .select()
      .from(d.users)
      .where(eq(d.users.username, username))

    if (!user) {
      return null
    }

    return user
  }

  async createUser(input: {
    username: string
    email: string
    password: string
    salt: string
  }) {
    const [user] = await this.dbWrapper.db
      .insert(d.users)
      .values({
        email: input.email,
        username: input.username,
        password: input.password,
        salt: input.salt,
      })
      .returning()

    return user
  }

  async findByUserId(userId: number) {
    const [user] = await this.dbWrapper.db
      .select()
      .from(d.users)
      .where(eq(d.users.id, userId))

    if (!user) {
      return null
    }

    return user
  }
}
