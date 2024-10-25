import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/entities'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async EditSalary(salary: number, id: string) {
    try {
      const client = await this.userRepository.findOne({ where: { id } })

      return this.userRepository.save({ ...client, salary })
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async EditPaymentDays(paymentDays: number[], id: string) {
    try {
      const client = await this.userRepository.findOne({ where: { id } })

      return this.userRepository.save({ ...client, paymentDays })
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }
}
