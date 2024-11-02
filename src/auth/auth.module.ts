import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Expense, Saving, User } from '../entities'
import { AuthGuard } from 'src/guards/auth.guard'
import { CronService, SomeService } from 'src/util'
import { ExpenseService } from 'src/expense/expense.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, Saving, Expense])],
  providers: [AuthService, SomeService, AuthGuard, CronService, ExpenseService],
  controllers: [AuthController],
})
export class AuthModule {}
