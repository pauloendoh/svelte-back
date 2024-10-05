import { ZodType } from 'zod'

export type InferType<T> = T extends ZodType<infer U> ? U : never
