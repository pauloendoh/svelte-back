import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { d } from 'src/database/drizzle/d';
import { myEnvs } from 'src/myEnvs';

const runMigration = async () => {
  const connection = postgres(myEnvs.DATABASE_URL, {
    onnotice: () => {},
  });
  const db = drizzle(connection, {
    schema: d,
  });

  await migrate(db, {
    migrationsFolder: __dirname +  '/migrations',
  });

  console.log('Migration complete 🎉');

  await connection.end();
};

runMigration();
