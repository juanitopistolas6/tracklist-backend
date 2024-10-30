import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../entities'
import { AuthGuard } from 'src/guards/auth.guard'
import { CronService, SomeService } from 'src/util'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService, SomeService, AuthGuard, CronService],
  controllers: [AuthController],
})
export class AuthModule {}
