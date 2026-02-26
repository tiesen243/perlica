import * as Data from 'effect/Data'

export class DrizzleError extends Data.TaggedError('DrizzleError')<{
  cause?: string
}> {
  override message: string = 'An error occurred while accessing the database'
}
