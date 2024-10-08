import { Get } from '@nestjs/common'
import { AppService } from './app.service'
import { MyController } from './utils/decorators/my-controller'

@MyController()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
