import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Saving, User } from '../entities'
import { Repository } from 'typeorm'
import { UserDto } from 'src/dto/user.dto'
import { CronService, SomeService } from 'src/util'
import { ExpenseService } from 'src/expense/expense.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Saving) private savingRepository: Repository<Saving>,
    private cronService: CronService,
    private someService: SomeService,
    private expenseService: ExpenseService,
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
        async () => {
          await this.handleCronPayemnt(newUser)
        },
        name,
      )

      return newUser
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async handleCronPayemnt(user: User) {
    const client = await this.userRepository.findOne({ where: { id: user.id } })

    let amountSalary: number = client.salary

    if (client.is_saving) {
      const saving = await this.savingRepository.findOne({
        where: { user: { id: user.id } },
      })

      amountSalary -= saving.saving

      const savingExpense = await this.someService.getDefaultExpense(
        saving.saving,
        'saving',
      )

      await this.expenseService.createExpense(savingExpense, client.id)
    }

    const salaryExpense = await this.someService.getDefaultExpense(
      amountSalary,
      'deposit',
    )

    await this.expenseService.createExpense(salaryExpense, client.id)
  }
}
