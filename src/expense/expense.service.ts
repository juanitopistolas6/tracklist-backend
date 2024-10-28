import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Expense } from 'src/entities'
import { ICreateExpense } from 'src/interfaces/expense'
import { Repository } from 'typeorm'

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense) private expenseRepository: Repository<Expense>,
  ) {}

  async Expenses(idAuthor: string) {
    return this.expenseRepository.find({
      where: { author: { id: idAuthor }, available: true },
    })
  }

  async createExpense(object: ICreateExpense, id: string) {
    try {
      const expense = this.expenseRepository.create({
        ...object,
        author: { id },
      })

      await this.expenseRepository.save(expense)

      return expense
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async deleteExpense(authorId: string, id: string) {
    try {
      const expense = await this.getExpense(id, authorId)

      return this.expenseRepository.save({ ...expense, available: false })
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
}
