import { Module } from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { myEnvs } from 'src/myEnvs';
import { d } from './drizzle/d';

export const DbProvider = 'DbProvider';
export interface IDbProvider extends PostgresJsDatabase<typeof d> {}

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: DbProvider,
      useFactory: async () => {
        const connection = postgres(myEnvs.DATABASE_URL, {
          onnotice: () => {},
        });
        const db = drizzle(connection, {
          schema: d,
        });

        return db;
      },
    },
  ],
  exports: [DbProvider],
})
export class DatabaseModule {}
