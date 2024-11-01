import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { User, Expense, Saving } from './entities'
import { UserModule } from './user/user.module'
import { ExpenseModule } from './expense/expense.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '6442340710juan1',
      synchronize: true,
      entities: [User, Expense, Saving],
      database: 'trackerlist',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    ExpenseModule,
  ],
})
export class AppModule {}
