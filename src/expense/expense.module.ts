import { Module } from '@nestjs/common'
import { ExpenseController } from './expense.controller'
import { ExpenseService } from './expense.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Expense } from '../entities'
import { AuthGuard } from 'src/guards/auth.guard'

@Module({
  imports: [TypeOrmModule.forFeature([Expense])],
  controllers: [ExpenseController],
  providers: [ExpenseService, AuthGuard],
})
export class ExpenseModule {}
