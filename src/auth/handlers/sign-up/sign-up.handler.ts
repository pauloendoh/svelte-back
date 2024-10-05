import { Injectable } from '@nestjs/common'
import { err, ok, ResultAsync } from 'neverthrow'
import { createHmac, randomBytes } from 'node:crypto'
import { UserRepository } from 'src/user/repository/user.repository'
import { SignUpInput } from './sign-up.input'
import { SignUpOutput, signUpOutputSchema } from './sign-up.output'

export enum SignUp409ErrorMessage {
  EmailInUse = 'The email address you entered is already in use. Please use a different email address.',
  UsernameInUse = 'The username you entered is already in use. Please use a different username.',
}

@Injectable()
export class SignUpHandler {
  constructor(private readonly userRepo: UserRepository) {}

  async exec(
    input: SignUpInput,
  ): Promise<ResultAsync<SignUpOutput, SignUp409ErrorMessage>> {
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

    return ok(signUpOutputSchema.parse(user))
  }

  #hashPassword(password: string, salt: string) {
    const hashedPassword = createHmac('sha512', salt)
      .update(password)
      .digest('hex')
    return hashedPassword
  }
}
