import { IsNotEmpty, IsNumber } from 'class-validator'

export class SavingDto {
  @IsNotEmpty()
  @IsNumber()
  saving: number
}
