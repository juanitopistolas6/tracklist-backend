import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '../guards/auth.guard'
import { SomeService } from '../util/some.service'
import { ExpenseService } from './expense.service'
import { Authorization, GetUser } from '../decorator'
import { ExpenseDto } from '../dto/expense.dto'
import { IExpense } from '../interfaces/expense'

@Controller('expense')
@UseGuards(AuthGuard)
export class ExpenseController {
  constructor(
    private someService: SomeService,
    private expenseService: ExpenseService,
  ) {}

  @Get()
  @Authorization(true)
  async getExpenses(@GetUser('id') idAuthor: string) {
    const expenses = await this.expenseService.Expenses(idAuthor)

    return this.someService.FormateData<IExpense[]>({
      data: expenses,
      message: 'EXPENSES_RETURNED',
    })
  }

  @Get(':id')
  @Authorization(true)
  async getExpense(
    @Param('id') idExpense: string,
    @GetUser('id') idAuthor: string,
  ) {
    try {
      const expense = await this.expenseService.getExpense(idExpense, idAuthor)

      return this.someService.FormateData<IExpense>({
        data: expense,
        message: 'EXPENSE_RETURNED',
      })
    } catch (e) {
      return this.someService.FormateData({ error: true, message: e.message })
    }
  }

  @Post()
  @Authorization(true)
  async createExpense(
    @Body() expenseDto: ExpenseDto,
    @GetUser('id') id: string,
  ) {
    try {
      const expense = await this.expenseService.createExpense(expenseDto, id)

      return this.someService.FormateData<IExpense>({
        data: expense,
        message: 'EXPENSE_CREATED',
      })
    } catch (e) {
      return this.someService.FormateData({ error: true, message: e.message })
    }
  }

  @Put(':id')
  @Authorization(true)
  async editExpense(
    @Param('id') id: string,
    @Body() expense: ExpenseDto,
    @GetUser('id') idUser: string,
  ) {
    try {
      const expenseEdit = await this.expenseService.editExpense(
        expense,
        idUser,
        id,
      )

      return this.someService.FormateData<IExpense>({
        data: expenseEdit,
        message: 'EXPENSE_EDITED',
      })
    } catch (e) {
      return this.someService.FormateData({ error: true, message: e.message })
    }
  }

  @Delete(':id')
  @Authorization(true)
  async deleteExpense(
    @Param('id') idExpense: string,
    @GetUser('id') userId: string,
  ) {
    try {
      const expenseDeleted = await this.expenseService.deleteExpense(
        userId,
        idExpense,
      )

      return this.someService.FormateData<IExpense>({
        data: expenseDeleted,
        message: 'EXPENSE_DELETED',
      })
    } catch (e) {
      return this.someService.FormateData({ error: true, message: e.message })
    }
  }
}
