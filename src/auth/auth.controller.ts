import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SomeService } from '../util/some.service'
import { LoginDto } from '../dto'
import { IResponse, IUser, Token } from '../interfaces'
import { Authorization, GetUser } from '../decorator'
import { UserDto } from '../dto/user.dto'
import { User } from '../entities'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private someService: SomeService,
  ) {}

  @Post()
  @Authorization(false)
  async createUser(@Body() user: UserDto): Promise<IResponse<User>> {
    try {
      console.log('ok???')
      const newUser = await this.authService.createUser(user)

      delete newUser.password
      delete newUser.salt

      return this.someService.FormateData<User>({
        data: newUser,
        message: 'USER_CREATED',
      })
    } catch (e) {
      return this.someService.FormateData({ error: true, message: e.message })
    }
  }

  @Post('login')
  @Authorization(false)
  async login(@Body() login: LoginDto): Promise<IResponse<Token>> {
    const { user, password } = login

    const client = await this.authService.User(user)

    const isVerified = await this.someService.verifyPassword(
      client.password,
      password,
      client.salt,
    )

    if (!isVerified)
      return this.someService.FormateData({
        error: true,
        message: 'UNATHORIZED',
      })

    delete client.password
    delete client.salt

    const token = await this.someService.generateSignature({ ...client })

    return this.someService.FormateData<Token>({
      data: { token, user: client },
      message: 'TOKEN_GENERATED',
    })
  }

  @Post('token')
  @Authorization(true)
  async verifyToken(@GetUser() user: IUser): Promise<IResponse<IUser>> {
    return this.someService.FormateData<IUser>({
      data: user,
      message: 'TOKEN_VERIFIED',
    })
  }
}
