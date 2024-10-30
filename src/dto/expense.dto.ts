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
  @IsEnum(['transfer', 'deposit', 'expense'])
  type?: 'transfer' | 'deposit' | 'expense'

  @IsNotEmpty()
  @IsNumber()
  amount: number
}
