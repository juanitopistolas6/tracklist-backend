import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common'
import { Authorization, GetUser } from 'src/decorator'
import { AuthGuard } from 'src/guards/auth.guard'
import { SavingService } from './saving.service'
import { SomeService } from 'src/util'
import { ISaving } from 'src/interfaces'
import { SavingDto } from 'src/dto'

@Controller('saving')
@UseGuards(AuthGuard)
export class SavingController {
  constructor(
    private savingService: SavingService,
    private someService: SomeService,
  ) {}

  @Get()
  @Authorization(true)
  async getSaving(@GetUser('id') idUser: string) {
    try {
      const saving = await this.savingService.saving(idUser)

      return this.someService.FormateData<ISaving>({
        data: saving,
        message: 'SAVING_RETURNED',
      })
    } catch (e) {
      return this.someService.FormateData({ error: true, message: e.message })
    }
  }

  @Post()
  @Authorization(true)
  async addSaving(@GetUser('id') idUser: string, @Body() savingDto: SavingDto) {
    try {
      const { saving } = savingDto

      const savings = await this.savingService.add(idUser, saving)

      return this.someService.FormateData<ISaving>({
        data: savings,
        message: 'SAVING_ADDED',
      })
    } catch (e) {
      return this.someService.FormateData({ error: true, message: e.message })
    }
  }

  @Delete()
  @Authorization(true)
  async removeSaving(@GetUser('id') idUser: string) {
    try {
      const saving = await this.savingService.remove(idUser)

      return this.someService.FormateData<ISaving>({
        data: saving,
        message: 'SAVING_DELETEDE',
      })
    } catch (e) {
      return this.someService.FormateData({ error: true, message: e.message })
    }
  }
}
