import {
  mysqlTable,
  varchar,
  char,
  timestamp,
  decimal,
  boolean,
  int
} from 'drizzle-orm/mysql-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const mortgageProfiles = mysqlTable('MortgageProfile', {
  id: char('id', { length: 36 }).primaryKey(),
  userId: char('userId', { length: 36 }).notNull(),
  propertyPrice: decimal('propertyPrice', {
    precision: 15,
    scale: 2
  }).notNull(),
  propertyType: varchar('propertyType', { length: 100 }).notNull(),
  //TODO можно сделать реализацию через enum для строгйо типизации?
  downPaymentAmount: decimal('downPaymentAmount', {
    precision: 15,
    scale: 2
  }).notNull(),
  matCapitalAmount: decimal('matCapitalAmount', {
    precision: 15,
    scale: 2
  }),
  matCapitalIncluded: boolean('matCapitalIncluded').notNull().default(false),
  loanTermYears: int('loanTermYears').notNull(),
  interestRate: decimal('interestRate', { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull()
});

export type MortgagePorfile = InferSelectModel<typeof mortgageProfiles>;
export type NewMortagePorfile = InferInsertModel<typeof mortgageProfiles>;
