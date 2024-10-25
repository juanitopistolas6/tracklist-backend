import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ExpenseDto {
  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsNumber()
  amount: number
}
