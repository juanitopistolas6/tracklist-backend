import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Saving, User } from 'src/entities'
import { Repository } from 'typeorm'

@Injectable()
export class SavingService {
  constructor(
    @InjectRepository(Saving) private savingRepository: Repository<Saving>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async saving(id: string) {
    const saving = await this.savingRepository.findOne({
      where: { user: { id } },
    })

    if (!saving) throw new NotFoundException('Saving not found')

    return saving
  }

  async add(id: string, saving: number) {
    try {
      const client = await this.userRepository.findOne({ where: { id } })

      if (!client || client.is_saving)
        throw new BadRequestException('Error while adding a saving')

      const savings = this.savingRepository.create({
        saving,
        user: { id },
      })

      return this.savingRepository.save(savings)
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async remove(id: string) {
    try {
      const saving = await this.savingRepository.findOne({
        where: { user: { id } },
      })

      if (!saving) throw new NotFoundException('User has no savings')

      return this.savingRepository.remove(saving)
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }
}
