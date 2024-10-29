import { Module } from '@nestjs/common'
import { ExpenseController } from './expense.controller'
import { ExpenseService } from './expense.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Expense, User } from '../entities'
import { SomeService } from 'src/util/some.service'

@Module({
  imports: [TypeOrmModule.forFeature([Expense, User])],
  controllers: [ExpenseController],
  providers: [ExpenseService, SomeService],
})
export class ExpenseModule {}
