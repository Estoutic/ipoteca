import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

const dbCredentials: any = {
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.PORT || '3306'),
  user: process.env.USERNAME || 'admin',
  password: process.env.PASSWORD || 'admin',
  database: process.env.DATABASE || 'test'
};

export default defineConfig({
  schema: './src/app/modules/**/schemas/*.ts',
  //TODO костыль надо разобрать (не читает через ./src/database/schema.ts)
  out: './database/migrations',
  dialect: 'mysql',
  dbCredentials,
  verbose: true,
  strict: true
});
