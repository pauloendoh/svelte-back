import { applyDecorators, Controller } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'

export function MyController() {
  return applyDecorators(Controller(), ApiBearerAuth())
}
