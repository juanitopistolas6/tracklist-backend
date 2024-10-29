import { Type } from 'class-transformer'
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class ExpenseDto {
  @IsNotEmpty()
  @IsString()
  description: string

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expenseDate?: Date

  @IsOptional()
  @IsEnum(['transfer', 'deposit'])
  type?: 'transfer' | 'deposit'

  @IsNotEmpty()
  @IsNumber()
  amount: number
}
