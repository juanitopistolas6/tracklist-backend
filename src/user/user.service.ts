import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Expense, User } from 'src/entities'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Expense) private expenseRepository: Repository<Expense>,
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

  async GetStats(id: string) {
    try {
      const client = await this.userRepository.findOne({ where: { id } })
      const expenses = await this.expenseRepository.find({
        where: { author: { id }, available: true, status: 'success' },
      })

      let totalExpenses = 0

      totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0)

      return {
        salary: client.salary,
        paymentDays: client.paymentDays,
        balance: client.balance,
        savings: client.savings,
        totalExpenses,
      }
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }
}
