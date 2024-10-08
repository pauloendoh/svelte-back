import { Injectable } from '@nestjs/common'
import { createHmac } from 'crypto'
import { ResultHandler } from 'src/utils/types/my-handlers'

@Injectable()
export class HashPasswordHandler implements ResultHandler<'regular'> {
  exec(input: { password: string; salt: string }) {
    const hashedPassword = createHmac('sha512', input.salt)
      .update(input.password)
      .digest('hex')
    return hashedPassword
  }
}
