import { Body, Controller, Put, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/guards/auth.guard'
import { UserService } from './user.service'
import { SomeService } from 'src/util/some.service'
import { Authorization, GetUser } from 'src/decorator'
import { SalaryDto } from 'src/dto/salary.dto'
import { User } from 'src/entities'
import { PaymentDaysDto } from 'src/dto'

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private someService: SomeService,
  ) {}

  @Put('salary')
  @Authorization(true)
  async updateSalary(@Body() salaryDto: SalaryDto, @GetUser('id') id: string) {
    const { salary } = salaryDto

    try {
      const updatedClient = await this.userService.EditSalary(salary, id)

      return this.someService.FormateData<User>({
        data: updatedClient,
        message: 'USER_UPDATED',
      })
    } catch (e) {
      return this.someService.FormateData({
        error: true,
        message: e.message,
      })
    }
  }

  @Put('payment-days')
  @Authorization(true)
  async updatePaymentDays(
    @Body() paymentDto: PaymentDaysDto,
    @GetUser('id') id: string,
  ) {
    const { paymentDays } = paymentDto

    try {
      const clientUpdated = await this.userService.EditPaymentDays(
        paymentDays,
        id,
      )

      return this.someService.FormateData<User>({
        data: clientUpdated,
        message: 'PAYMENT_DAYS_UPDATED',
      })
    } catch (e) {
      return this.someService.FormateData({ error: true, message: e.message })
    }
  }
}
