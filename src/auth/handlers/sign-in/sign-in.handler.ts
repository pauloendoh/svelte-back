import { Injectable } from '@nestjs/common'
import { err, ok, ResultAsync } from 'neverthrow'
import { AuthUserOutput } from 'src/auth/types/auth-user.output'
import { UserRepository } from 'src/user/repository/user.repository'
import { AsyncResultHandler } from 'src/utils/types/my-handlers'
import { HashPasswordHandler } from '../hash-password/hash-password-handler'
import { SignUserJwtHandler } from '../sign-user-jwt/sign-user-jwt.handler'
import { SignInInput } from './sign-in.input'

export enum SignInErrorMessage {
  invalidUsernameEmailOrPassword = 'Invalid username, email, or password.',
}

@Injectable()
export class SignInHandler implements AsyncResultHandler {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly getSignInTokenHandler: SignUserJwtHandler,
    private readonly hashPasswordHandler: HashPasswordHandler,
  ) {}

  async try(
    input: SignInInput,
  ): Promise<ResultAsync<AuthUserOutput, SignInErrorMessage>> {
    const byEmail = await this.userRepo.findUserByEmail(input.usernameOrEmail)
    const byUsername = await this.userRepo.findUserByUsername(
      input.usernameOrEmail,
    )

    const foundUser = byEmail || byUsername

    if (!foundUser) {
      return err(SignInErrorMessage.invalidUsernameEmailOrPassword)
    }

    const hashedPassword = this.hashPasswordHandler.exec({
      password: input.password,
      salt: foundUser.salt,
    })

    if (hashedPassword !== foundUser.password) {
      return err(SignInErrorMessage.invalidUsernameEmailOrPassword)
    }

    const { token, tokenExpiresAt } = this.getSignInTokenHandler.exec({
      userId: foundUser.id,
    })

    return ok({
      token,
      tokenExpiresAt,
      email: foundUser.email,
      id: foundUser.id,
      username: foundUser.username,
    })
  }
}
