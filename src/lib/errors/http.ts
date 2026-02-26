import * as Data from 'effect/Data'

export class HttpError extends Data.TaggedError('HttpError')<{
  status: number
  message: string
}> {}
