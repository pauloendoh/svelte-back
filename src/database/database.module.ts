import { Module } from '@nestjs/common'
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { myEnvs } from 'src/myEnvs'
import { DbWrapper } from './db-wrapper'
import { d } from './drizzle/d'

export const DatabaseProvider = 'DatabaseProvider'
export interface IDatabaseProvider extends PostgresJsDatabase<typeof d> {}

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: DatabaseProvider,
      useFactory: async () => {
        const connection = postgres(myEnvs.DATABASE_URL, {
          onnotice: () => {},
        })
        const db = drizzle(connection, {
          schema: d,
        })

        return db
      },
    },
    DbWrapper,
  ],
  exports: [DatabaseProvider, DbWrapper],
})
export class DatabaseModule {}
