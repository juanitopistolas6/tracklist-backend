import { type HttpStatus } from '@nestjs/common'

export interface IFormateDataParams<D> {
  data?: D
  message: string
  status?: HttpStatus
  error?: boolean
}
