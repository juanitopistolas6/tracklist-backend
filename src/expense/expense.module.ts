import { Module } from '@nestjs/common'
import { ExpenseController } from './expense.controller'
import { ExpenseService } from './expense.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Expense } from '../entities'
import { SomeService } from 'src/util/some.service'

@Module({
  imports: [TypeOrmModule.forFeature([Expense])],
  controllers: [ExpenseController],
  providers: [ExpenseService, SomeService],
})
export class ExpenseModule {}
