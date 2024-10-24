import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/entities'
import { ILogin } from 'src/interfaces/login'
import { Repository } from 'typeorm'

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
}
