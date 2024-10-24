import { type HttpStatus } from '@nestjs/common'

export interface IResponse<T> {
  data: T
  message: string
  status: HttpStatus
}
