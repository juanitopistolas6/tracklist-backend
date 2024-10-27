import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'
import { IResponse, IFormateDataParams } from '../interfaces'
import * as bcrypt from 'bcrypt'

@Injectable()
export class SomeService {
  constructor(private config: ConfigService) {}

  async generateSignature(payload: object) {
    return jwt.sign({ payload }, this.config.get('SECRET_KEY'), {
      expiresIn: '1d',
    })
  }

  async generatePassword(password: string, salt: string) {
    return bcrypt.hash(password, salt)
  }

  async verifySignature(token: string) {
    try {
      const payload = jwt.verify(token, this.config.get('SECRET_KEY'))

      return payload
    } catch (e) {
      throw new UnauthorizedException(e.message)
    }
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
