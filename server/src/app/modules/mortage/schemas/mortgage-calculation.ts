import {
  mysqlTable,
  char,
  timestamp,
  decimal,
  text
} from 'drizzle-orm/mysql-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const mortgageCalculations = mysqlTable('MortgageCalculation', {
  id: char('id', { length: 36 }).primaryKey(),
  userId: char('userId', { length: 36 }).notNull(),
  mortgageProfileId: char('mortgageProfileId', { length: 36 }).notNull(),
  monthlyPayment: decimal('monthlyPayment', {
    precision: 15,
    scale: 2
  }).notNull(),
  totalPayment: decimal('totalPayment', {
    precision: 15,
    scale: 2
  }).notNull(),
  totalOverpaymentAmount: decimal('totalOverpaymentAmount', {
    precision: 15,
    scale: 2
  }).notNull(),
  possibleTaxDeduction: decimal('possibleTaxDeduction', {
    precision: 15,
    scale: 2
  }).notNull(),
  savingsDueMotherCapital: decimal('savingsDueMotherCapital', {
    precision: 15,
    scale: 2
  }).notNull(),
  recommendedIncome: decimal('recommendedIncome', {
    precision: 15,
    scale: 2
  }).notNull(),
  paymentSchedule: text('paymentSchedule').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull()
});

export type MortgageCalculation = InferSelectModel<typeof mortgageCalculations>;
export type NewMortgageCalculation = InferInsertModel<typeof mortgageCalculations>;
