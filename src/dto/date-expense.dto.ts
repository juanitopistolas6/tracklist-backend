import { Type } from 'class-transformer'
import { IsDate } from 'class-validator'

export class DateExpense {
  @IsDate()
  @Type(() => Date)
  date: Date
}
