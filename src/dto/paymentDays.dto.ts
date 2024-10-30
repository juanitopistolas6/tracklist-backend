import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator'

export class PaymentDaysDto {
  @IsNotEmpty()
  @IsArray({ each: true })
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  paymentDays: number[]
}
