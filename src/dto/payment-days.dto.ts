import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator'

export class PaymentDaysDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  paymentDays: number[]
}
