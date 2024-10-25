import { IsNotEmpty, IsNumber } from 'class-validator'

export class SalaryDto {
  @IsNotEmpty()
  @IsNumber()
  salary: number
}
