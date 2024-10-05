import { Result, ResultAsync } from 'neverthrow'

export interface MyHandler<TInput = any, TOutput = any, TError = any> {
  exec(input: TInput): TOutput
}

export interface MyResultHandler<TInput = any, TOutput = any, TError = any> {
  try(input: TInput): Result<TOutput, TError>
}

export type MyAsyncHandler<TInput = any, TOutput = any, TError = any> = {
  exec(input: TInput): Promise<TOutput>
}

export type MyResultAsyncHandler<TInput = any, TOutput = any, TError = any> = {
  try(input: TInput): Promise<ResultAsync<TOutput, TError>>
}
