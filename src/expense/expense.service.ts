import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Expense } from 'src/entities'
import { ICreateExpense } from 'src/interfaces/expense'
import { Repository } from 'typeorm'

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense) private expenseRepository: Repository<Expense>,
  ) {}

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
}
