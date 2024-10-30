import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Expense, User } from 'src/entities'
import { ExpenseTypes, IDateInterval } from 'src/interfaces'
import { ICreateExpense } from 'src/interfaces/expense'
import { CronService } from 'src/util'
import { Between, DataSource, Repository } from 'typeorm'

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense) private expenseRepository: Repository<Expense>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private cronService: CronService,
    private dataSource: DataSource,
  ) {}

  async Expenses(idAuthor: string) {
    return this.expenseRepository.find({
      where: { author: { id: idAuthor }, available: true },
    })
  }

  async createExpense(object: ICreateExpense, id: string) {
    let user: User
    let expense: Expense
    let name: string

    try {
      user = await this.userRepository.findOne({ where: { id } })

      if (object.amount > user.balance && object.type == 'transfer')
        throw new BadRequestException('Insufficient Funds')

      expense = this.expenseRepository.create({
        ...object,
        author: { id },
      })

      if (object.expenseDate) {
        name = `${expense.type} pay/deposit, expense: ${expense.id} `

        await this.cronService.createDateCronJob(
          name,
          async () => {
            await this.cronExpense(user, expense)
          },
          expense.expenseDate,
        )

        return expense
      }

      return this.handleExpense(object.type, user, expense)
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async handleExpense(type: ExpenseTypes, user: User, expense: Expense) {
    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      if (!user || !expense) throw new NotFoundException('Data not found')

      let balance: number

      switch (type) {
        case 'delete': {
          balance =
            expense.type == 'deposit'
              ? user.balance - expense.amount
              : user.balance + expense.amount

          expense.available = false

          break
        }
        case 'deposit': {
          balance = expense.amount + user.balance

          break
        }
        case 'expense':
        case 'transfer': {
          balance = user.balance - expense.amount

          break
        }
      }

      await queryRunner.manager.save(expense)
      await queryRunner.manager.save(User, { ...user, balance })

      await queryRunner.commitTransaction()

      return expense
    } catch (e) {
      await queryRunner.rollbackTransaction()

      throw new BadRequestException(e.message)
    } finally {
      await queryRunner.release()
    }
  }

  async expenseByDate(date: Date, idAuthor: string) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const expense = await this.expenseRepository.find({
      where: {
        expenseDate: Between(startOfDay, endOfDay),
        available: true,
        author: { id: idAuthor },
      },
    })

    if (expense.length < 1)
      throw new NotFoundException('Expense not found in that date')

    return expense
  }

  async expensesDates(intervalDates: IDateInterval, idAuthor: string) {
    const { endDate, startDate } = intervalDates

    try {
      const expense = await this.expenseRepository.find({
        where: {
          expenseDate: Between(startDate, endDate),
          author: { id: idAuthor },
          available: true,
        },
      })

      if (!expense)
        throw new NotFoundException(
          'No expenses were found between that interval',
        )

      return expense
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async deleteExpense(authorId: string, id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } })
      const expense = await this.getExpense(id, authorId)

      return this.handleExpense('delete', user, expense)
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async getExpense(id: string, authorId: string) {
    try {
      const client = await this.expenseRepository.findOne({
        where: { id, available: true, author: { id: authorId } },
      })

      if (!client) throw new NotFoundException('Expense not found')

      return client
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async editExpense(
    expenseEdit: ICreateExpense,
    authorId: string,
    expenseId: string,
  ) {
    try {
      const expense = await this.getExpense(expenseId, authorId)

      return this.expenseRepository.save({ ...expense, ...expenseEdit })
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async cronExpense(user: User, expense: Expense) {
    try {
      const balance =
        expense.type == 'deposit'
          ? user.balance + expense.amount
          : user.balance - expense.amount

      console.log('CronExpense executting....')
      await this.userRepository.save({ ...user, balance })
    } catch (e) {
      console.log(e.message)
    }
  }
}
