import { Result, ResultAsync } from 'neverthrow'

interface MyHandler<TInput = any, TOutput = any, TError = any> {
  exec(input: TInput): TOutput
}

interface MyResultHandler<TInput = any, TOutput = any, TError = any> {
  try(input: TInput): Result<TOutput, TError>
}

type MyAsyncHandler<TInput = any, TOutput = any, TError = any> = {
  exec(input: TInput): Promise<TOutput>
}

type MyResultAsyncHandler<TInput = any, TOutput = any, TError = any> = {
  try(input: TInput): Promise<ResultAsync<TOutput, TError>>
}

// make a generic handler type, that receives "result" | "regular" as a type parameter
export type ResultHandler<
  TResultType extends 'result' | 'regular' = 'result',
  TInput = any,
  TOutput = any,
  TError = any,
> = TResultType extends 'result'
  ? MyResultHandler<TInput, TOutput, TError>
  : MyHandler<TInput, TOutput, TError>

export type AsyncResultHandler<
  TResultType extends 'result' | 'regular' = 'result',
  TInput = any,
  TOutput = any,
  TError = any,
> = TResultType extends 'result'
  ? MyResultAsyncHandler<TInput, TOutput, TError>
  : MyAsyncHandler<TInput, TOutput, TError>
