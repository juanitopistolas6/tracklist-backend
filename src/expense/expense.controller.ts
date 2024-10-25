import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/guards/auth.guard'
import { SomeService } from 'src/util/some.service'
import { ExpenseService } from './expense.service'
import { Authorization, GetUser } from 'src/decorator'
import { ExpenseDto } from 'src/dto/expense.dto'
import { IExpense } from 'src/interfaces/expense'

@Controller('expense')
@UseGuards(AuthGuard)
export class ExpenseController {
  constructor(
    private someService: SomeService,
    private expenseService: ExpenseService,
  ) {}

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
}
