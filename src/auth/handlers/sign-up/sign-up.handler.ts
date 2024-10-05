import { Injectable } from '@nestjs/common'
import { err, ok, ResultAsync } from 'neverthrow'
import { createHmac, randomBytes } from 'node:crypto'
import { UserRepository } from 'src/user/repository/user.repository'
import { MyResultAsyncHandler } from 'src/utils/types/my-handlers'
import { SignUpLogInOutput } from '../../types/sign-up-log-in.output'
import { GetSignInTokenHandler } from '../get-sign-in-token/get-sign-in-token.handler'
import { SignUpInput } from './sign-up.input'

export enum SignUp409ErrorMessage {
  EmailInUse = 'The email address you entered is already in use. Please use a different email address.',
  UsernameInUse = 'The username you entered is already in use. Please use a different username.',
}

@Injectable()
export class SignUpHandler implements MyResultAsyncHandler {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly getSignInTokenHandler: GetSignInTokenHandler,
  ) {}

  async try(
    input: SignUpInput,
  ): Promise<ResultAsync<SignUpLogInOutput, SignUp409ErrorMessage>> {
    const emailExists = await this.userRepo.findUserByEmail(input.email)

    if (emailExists) {
      return err(SignUp409ErrorMessage.EmailInUse)
    }

    const usernameExists = await this.userRepo.findUserByUsername(
      input.username,
    )
    if (usernameExists) {
      return err(SignUp409ErrorMessage.UsernameInUse)
    }

    const salt = randomBytes(16).toString('hex')
    const hashedPassword = this.#hashPassword(input.password1, salt)

    const user = await this.userRepo.createUser({
      email: input.email,
      username: input.username,
      password: hashedPassword,
      salt,
    })

    const { token, expiresAt } = this.getSignInTokenHandler.exec(user.id)

    return ok({
      email: user.email,
      id: user.id,
      token,
      tokenExpiresAt: expiresAt.toISOString(),
      username: user.username,
    })
  }

  #hashPassword(password: string, salt: string) {
    const hashedPassword = createHmac('sha512', salt)
      .update(password)
      .digest('hex')
    return hashedPassword
  }
}
