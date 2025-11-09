import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { User, Expense, Saving } from './entities'
import { UserModule } from './user/user.module'
import { ExpenseModule } from './expense/expense.module'
import { ScheduleModule } from '@nestjs/schedule'
import { SavingModule } from './saving/saving.module'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.RAILWAY_MYSQL,
      synchronize: false,
      entities: [User, Expense, Saving],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    ExpenseModule,
    SavingModule,
  ],
})
export class AppModule {}
