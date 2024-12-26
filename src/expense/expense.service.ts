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

  async Expenses(idAuthor: string, page: number, limit: number) {
    const [results, total] = await this.expenseRepository.findAndCount({
      where: { author: { id: idAuthor }, available: true },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        expenseDate: 'DESC',
      },
    })

    return {
      expenses: results,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async createExpense(object: ICreateExpense, id: string) {
    let user: User
    let expense: Expense
    let name: string

    try {
      user = await this.userRepository.findOne({ where: { id } })

      if (object.amount > user.balance && object.type == 'expense')
        throw new BadRequestException('Insufficient Funds')

      expense = this.expenseRepository.create({
        ...object,
        author: { id },
      })

      if (object.expenseDate > new Date()) {
        name = `${expense.type} pay/deposit, expense: ${expense.id}`
        expense.status = 'pending'

        await this.cronService.createDateCronJob(
          name,
          async () => {
            await this.cronExpense(user.id, expense.id)
          },
          expense.expenseDate,
        )
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

      if (expense.status == 'pending' && type !== 'delete') {
        await queryRunner.manager.save(User, user)
        await queryRunner.manager.save(Expense, expense)

        await queryRunner.commitTransaction()

        return expense
      }

      expense.available = type !== 'delete'

      const { balance, savings } = this.calculateBalances(user, expense, type)

      await queryRunner.manager.save(expense)
      await queryRunner.manager.save(User, { ...user, balance, savings })

      await queryRunner.commitTransaction()

      return expense
    } catch (e) {
      await queryRunner.rollbackTransaction()

      throw new BadRequestException(e.message)
    } finally {
      await queryRunner.release()
    }
  }

  calculateBalances(user: User, expense: Expense, type: ExpenseTypes) {
    if (expense.status == 'pending')
      return { balance: user.balance, savings: user.savings }

    const adjusment = this.getBalanceAdjustment(expense, type)

    const balance = user.balance + (expense.type === 'saving' ? 0 : adjusment)
    const savings = user.savings + (expense.type === 'saving' ? adjusment : 0)

    return { balance, savings }
  }

  getBalanceAdjustment(expense: Expense, type: ExpenseTypes): number {
    const adjusment =
      expense.type == 'deposit' || expense.type == 'saving'
        ? expense.amount
        : -expense.amount

    return type == 'delete' ? -adjusment : adjusment
  }

  async expenseByDate(date: Date, idAuthor: string) {
    const endOfDay = new Date(
      date.getTime() + (23 * 60 * 60 + 59 * 60 + 59) * 1000,
    )

    const expense = await this.expenseRepository.find({
      where: {
        expenseDate: Between(date, endOfDay),
        available: true,
        author: { id: idAuthor },
      },
      order: { expenseDate: 'ASC' },
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
        order: { expenseDate: 'ASC' },
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
      const user = await this.userRepository.findOne({
        where: { id: authorId },
      })
      const expense = await this.getExpense(id, authorId)

      return this.handleExpense('delete', user, expense)
    } catch (e) {
      console.log(e.message)
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

      if (expense.type !== expenseEdit.type)
        throw new BadRequestException(
          'You cannot change the type of the expense',
        )

      const user = await this.userRepository.findOne({
        where: { id: authorId },
      })

      const balance = user.balance + this.calculateEdit(expense, expenseEdit)

      if (balance < 0) throw new BadRequestException('Insufficient Funds')

      await this.userRepository.save({
        ...user,
        balance,
      })

      return this.expenseRepository.save({ ...expense, ...expenseEdit })
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  calculateEdit(expense: Expense, expenseEdit: ICreateExpense) {
    let difference = Math.abs(expense.amount - expenseEdit.amount)

    difference = expense.amount > expenseEdit.amount ? -difference : difference

    difference = expense.type == 'expense' ? -difference : difference

    console.log(difference)

    return difference
  }

  async cronExpense(userId: string, expenseId: string) {
    try {
      const expense = await this.getExpense(expenseId, userId)

      const user = await this.userRepository.findOne({ where: { id: userId } })

      expense.status = 'success'

      return this.handleExpense(expense.type, user, expense)
    } catch (e) {
      console.log(e.message)
    }
  }
}
