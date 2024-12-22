import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { SomeService } from '../util/some.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Expense, User } from '../entities'

@Module({
  imports: [TypeOrmModule.forFeature([User, Expense])],
  controllers: [UserController],
  providers: [UserService, SomeService],
})
export class UserModule {}
