import { defineConfig } from 'drizzle-kit';
import { myEnvs } from 'src/myEnvs';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/drizzle/drizzle.schema.ts',
  out: './src/database/drizzle/migrations',
  dbCredentials: {
    url: myEnvs.DATABASE_URL,
  },
});
