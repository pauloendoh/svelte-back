import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { DatabaseProvider, IDatabaseProvider } from './database.module'

// so you don't need to remember to forward ref every time
// similar to httpService.axiosRef
@Injectable()
export class DbWrapper {
  constructor(
    @Inject(forwardRef(() => DatabaseProvider))
    public readonly db: IDatabaseProvider,
  ) {}
}
