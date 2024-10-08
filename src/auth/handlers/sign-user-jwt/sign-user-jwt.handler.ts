import { sign } from 'jsonwebtoken'

import { Injectable } from '@nestjs/common'
import { myEnvs } from 'src/myEnvs'
import { ResultHandler } from 'src/utils/types/my-handlers'

@Injectable()
export class SignUserJwtHandler implements ResultHandler<'regular'> {
  exec(input: { userId: number }) {
    const expiresAt = new Date(new Date().setDate(new Date().getDate() + 365))
    const ONE_YEAR_IN_SECONDS = 3600 * 24 * 365

    const token = sign({ userId: input.userId }, String(myEnvs.JWT_SECRET), {
      expiresIn: ONE_YEAR_IN_SECONDS,
    })
    return { token, tokenExpiresAt: expiresAt.toISOString() }
  }
}
