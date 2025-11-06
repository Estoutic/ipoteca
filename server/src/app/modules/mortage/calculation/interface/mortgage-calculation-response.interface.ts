import { MortgagePaymentSchedule } from './mortgage-payment.interface';

export interface MortgageCalculationResponse {
  monthlyPayment: number;
  totalPayment: number;
  totalOverpaymentAmount: number;
  possibleTaxDeduction: number;
  savingsDueMotherCapital: number;
  recommendedIncome: number;
  mortgagePaymentSchedule: MortgagePaymentSchedule;
}