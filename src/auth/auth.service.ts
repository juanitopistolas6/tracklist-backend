import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities'
import { Repository } from 'typeorm'
import { UserDto } from 'src/dto/user.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async User(user: string) {
    const client = await this.userRepository.findOne({
      where: {
        user,
      },
    })

    if (!client) throw new UnauthorizedException()

    return client
  }

  async createUser(user: UserDto) {
    try {
      const newUser = this.userRepository.create({ ...user })

      await this.userRepository.save(newUser)

      return newUser
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }
}
