import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator'

enum PaymentFrequency {
  Weekly = 'weekly',
  Biweekly = 'biweekly',
}

export class UserDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  user: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsEnum(PaymentFrequency)
  paymentFrequency: 'weekly' | 'biweekly'

  @IsNotEmpty()
  @IsNumber()
  salary: number

  @IsNotEmpty()
  @IsNumber()
  balance: number

  @IsNotEmpty()
  @IsArray()
  paymentDays: number[]
}
