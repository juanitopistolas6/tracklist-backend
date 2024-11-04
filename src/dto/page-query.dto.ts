import { Transform } from 'class-transformer'
import { IsNumber, Min } from 'class-validator'

export class PaginationDto {
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page: number = 1

  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  limit: number = 10
}
