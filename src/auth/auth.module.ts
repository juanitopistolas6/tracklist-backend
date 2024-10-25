import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../entities'
import { SomeService } from 'src/util/some.service'
import { AuthGuard } from 'src/guards/auth.guard'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService, SomeService, AuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
