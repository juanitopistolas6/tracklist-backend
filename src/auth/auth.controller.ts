import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SomeService } from '../util/some.service'
import { LoginDto } from '../dto'
import { IResponse, Token } from 'src/interfaces'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private someService: SomeService,
  ) {}

  @Post('login')
  async login(@Body() login: LoginDto): IResponse<Token> {
    const { user } = login

    const client = await this.authService.User(user)

    const isVerified = await this.someService.verifyPassword()
  }
}
