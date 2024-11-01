import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities'
import { Repository } from 'typeorm'
import { UserDto } from 'src/dto/user.dto'
import { CronService } from 'src/util'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private cronService: CronService,
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
    let newUser: User
    let name: string

    try {
      newUser = this.userRepository.create({ ...user })

      await this.userRepository.save(newUser)

      name = `${user.paymentFrequency} pay to ${user.name}`

      await this.cronService.createCronJob(
        newUser,
        async () => this.cronPayemnt(),
        name,
      )

      return newUser
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async cronPayemnt() {
    // TODO
  }
}
