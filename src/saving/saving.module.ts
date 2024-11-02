import { Module } from '@nestjs/common'
import { SavingService } from './saving.service'
import { SavingController } from './saving.controller'
import { AuthGuard } from 'src/guards/auth.guard'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Saving, User } from 'src/entities'
import { SomeService } from 'src/util'

@Module({
  imports: [TypeOrmModule.forFeature([Saving, User])],
  providers: [SavingService, AuthGuard, SomeService],
  controllers: [SavingController],
})
export class SavingModule {}
