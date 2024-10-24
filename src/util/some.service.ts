import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import jwt from 'jsonwebtoken'
import { IResponse, IFormateDataParams } from '../interfaces'
import bcrypt from 'bcrypt'

@Injectable()
export class SomeService {
  constructor(private config: ConfigService) {}

  async generateSignature(payload: object) {
    return jwt.sign(payload, this.config.get('SECRET_KEY'), {
      expiresIn: '1d',
    })
  }

  async generatePassword(passowrd: string, salt: string) {
    return await bcrypt.hash(passowrd, salt)
  }

  async verifyPassword(
    dataPassword: string,
    inputPassowrd: string,
    salt: string,
  ) {
    return (await this.generatePassword(inputPassowrd, salt)) == dataPassword
  }

  async FormateData<D>({
    data,
    message,
    status = HttpStatus.OK,
    error = false,
  }: IFormateDataParams<D>): Promise<IResponse<D>> {
    return {
      status: error ? HttpStatus.BAD_REQUEST : status,
      message,
      data: error ? null : data,
    }
  }
}
