import { Injectable } from '@nestjs/common'
import { err, ok, ResultAsync } from 'neverthrow'
import { randomBytes } from 'node:crypto'
import { AuthUserOutput } from 'src/auth/types/auth-user.output'
import { UserRepository } from 'src/user/repository/user.repository'
import { AsyncResultHandler } from 'src/utils/types/my-handlers'
import { HashPasswordHandler } from '../hash-password/hash-password-handler'
import { SignUserJwtHandler } from '../sign-user-jwt/sign-user-jwt.handler'
import { SignUpInput } from './sign-up.input'

export enum SignUp409ErrorMessage {
  EmailInUse = 'The email address you entered is already in use. Please use a different email address.',
  UsernameInUse = 'The username you entered is already in use. Please use a different username.',
}

@Injectable()
export class SignUpHandler implements AsyncResultHandler {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly getSignInTokenHandler: SignUserJwtHandler,
    private readonly hashPasswordHandler: HashPasswordHandler,
  ) {}

  async try(
    input: SignUpInput,
  ): Promise<ResultAsync<AuthUserOutput, SignUp409ErrorMessage>> {
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
    const hashedPassword = this.hashPasswordHandler.exec({
      password: input.password1,
      salt,
    })

    const user = await this.userRepo.createUser({
      email: input.email,
      username: input.username,
      password: hashedPassword,
      salt,
    })

    const { token, tokenExpiresAt: expiresAt } =
      this.getSignInTokenHandler.exec({
        userId: user.id,
      })

    return ok({
      email: user.email,
      id: user.id,
      token,
      tokenExpiresAt: expiresAt,
      username: user.username,
    })
  }
}
