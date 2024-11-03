import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'
import { User } from 'src/entities'

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name)

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  obtainPaymentDays(user: User) {
    switch (user.paymentFrequency) {
      case 'biweekly': {
        const [day1, day2] = user.paymentDays
        return `0 0 ${day1},${day2} * *`
      }
      case 'weekly': {
        const [dayOfWeek] = user.paymentDays
        return `0 0 * * ${dayOfWeek}`
      }
    }
  }

  async createDateCronJob(
    name: string,
    callback: () => Promise<void>,
    date: Date,
  ) {
    const jobCallback = async () => {
      try {
        await callback()
      } catch (error) {
        this.logger.error(
          `Error executing cron job "${name}": ${error.message}`,
        )
      } finally {
        this.schedulerRegistry.deleteCronJob(name)
      }
    }

    try {
      const job = new CronJob(date, jobCallback, null, true)

      this.schedulerRegistry.addCronJob(name, job)

      this.logger.log(`cronjob creado: ${name}`)
    } catch (error) {
      this.logger.error(`Failed to create cron job "${name}": ${error.message}`)
    }
  }

  async createCronJob(user: User, callback: () => Promise<void>, name: string) {
    try {
      const cronTime = this.obtainPaymentDays(user)

      const job = new CronJob(
        cronTime,
        async function () {
          try {
            await callback()
          } catch (e) {
            this.logger.log(e.message)
          }
        },
        null,
        false,
      )

      this.schedulerRegistry.addCronJob(name, job)

      this.logger.log(`cronjob creado: ${name}`)
    } catch (e) {
      console.log(e.message)
      throw new BadRequestException(e.message)
    }
  }

  Jobs() {
    const jobs = this.schedulerRegistry.getCronJobs()

    const jobNames = []

    jobs.forEach((job, name) => {
      jobNames.push({
        name: name,
        nextExecution: job.nextDates()?.toString(), // Proxima ejecución (opcional)
      })
    })

    return jobNames
  }

  deleteCronJob(cronName: string) {
    const cronToDelete = this.schedulerRegistry.getCronJob(cronName)

    if (!cronToDelete) return

    this.schedulerRegistry.deleteCronJob(cronName)
  }

  editPaymentJob(name: string, user: User, callback: () => Promise<void>) {
    const cronJob = this.schedulerRegistry.getCronJob(name)

    if (!cronJob) throw new NotFoundException('CronJob not found')

    this.schedulerRegistry.deleteCronJob(name)

    this.createCronJob(user, callback, name)
  }

  getCronJobs() {
    const jobs = this.schedulerRegistry.getCronJobs()

    try {
      const jobDetails = []
      jobs.forEach((job: CronJob, name: string) => {
        jobDetails.push({
          name,
          nextExecution: job.nextDates().toDate(),
          running: job.running,
        })
      })

      return jobDetails
    } catch (e) {
      throw new InternalServerErrorException(e.message)
    }
  }
}
