import { Injectable } from '@nestjs/common'
import { verify } from 'jsonwebtoken'
import { UserDb } from 'src/database/drizzle/drizzle.tables.schemas'
import { myEnvs } from 'src/myEnvs'
import { UserRepository } from 'src/user/repository/user.repository'
import { AsyncResultHandler } from 'src/utils/types/my-handlers'
import { z } from 'zod'

@Injectable()
export class GetUserByJwtHandler implements AsyncResultHandler<'regular'> {
  constructor(private readonly userRepo: UserRepository) {}

  async exec(token: string): Promise<UserDb | null> {
    const result = await new Promise<UserDb>((res, rej) => {
      verify(token, myEnvs.JWT_SECRET, async (error, decoded) => {
        if (error) {
          return rej(new Error(error.message))
        }

        const { data, error: zodError } = z
          .object({
            userId: z.number(),
          })
          .safeParse(decoded)
        if (zodError) {
          return rej(zodError)
        }

        const user = await this.userRepo.findByUserId(data.userId)

        if (!user) return rej(new Error('User not found'))

        return res(user)
      })
    }).catch(() => null)

    return result
  }
}
