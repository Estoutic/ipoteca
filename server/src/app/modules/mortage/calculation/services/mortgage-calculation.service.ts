import { Injectable, Inject } from '@nestjs/common';
import { Database } from 'src/database/schema';
import { mortgageCalculations } from '../schemas/mortgage-calculation.schema';
import { MortgageCalculationResponse } from '../interface/mortgage-calculation-response.interface';
import { CreateMortgageProfileDto } from '../../profile/dto/create-mortgage-profile.dto';
import { MortgagePayment, MortgagePaymentSchedule } from '../interface/mortgage-payment.interface';

@Injectable()
export class MortgageCalculationService {
  constructor(@Inject('DATABASE') private readonly db: Database) {}

  async create(
    calculationResult: MortgageCalculationResponse,
    userId: string,
    mortgageProfileId: string
  ): Promise<string> {
    const calculationId = crypto.randomUUID();
    const calculationData = {
      id: calculationId,
      userId,
      mortgageProfileId,
      monthlyPayment: calculationResult.monthlyPayment.toString(),
      totalPayment: calculationResult.totalPayment.toString(),
      totalOverpaymentAmount:
        calculationResult.totalOverpaymentAmount.toString(),
      possibleTaxDeduction: calculationResult.possibleTaxDeduction.toString(),
      savingsDueMotherCapital:
        calculationResult.savingsDueMotherCapital.toString(),
      recommendedIncome: calculationResult.recommendedIncome.toString(),
      paymentSchedule: JSON.stringify(calculationResult.mortgagePaymentSchedule)
    };

    await this.db.insert(mortgageCalculations).values(calculationData);

    return calculationId;
  }

  calculate(dto: CreateMortgageProfileDto): MortgageCalculationResponse {
    const matCapital =
      dto.matCapitalIncluded && dto.matCapitalAmount ? dto.matCapitalAmount : 0;
    const loanAmount = dto.propertyPrice - dto.downPaymentAmount - matCapital;

    const totalMonths = dto.loanTermYears * 12;

    const monthlyRate = dto.interestRate / 12 / 100;

    const monthlyPayment = this.calculateMonthlyPayment(
      loanAmount,
      monthlyRate,
      totalMonths
    );

    const totalPayment = monthlyPayment * totalMonths;

    const totalOverpaymentAmount = totalPayment - loanAmount;

    const possibleTaxDeduction = this.calculateTaxDeduction(
      dto.propertyPrice,
      totalOverpaymentAmount
    );

    const mortgagePaymentSchedule = this.generatePaymentSchedule(
      loanAmount,
      monthlyRate,
      monthlyPayment,
      totalMonths
    );

    const savingsDueMotherCapital =
      matCapital > 0
        ? this.calculateMatCapitalSavings(matCapital, monthlyRate, totalMonths)
        : 0;

    const recommendedIncome = monthlyPayment / 0.4;

    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalOverpaymentAmount: Math.round(totalOverpaymentAmount * 100) / 100,
      possibleTaxDeduction: Math.round(possibleTaxDeduction * 100) / 100,
      savingsDueMotherCapital: Math.round(savingsDueMotherCapital * 100) / 100,
      recommendedIncome: Math.round(recommendedIncome * 100) / 100,
      mortgagePaymentSchedule
    };
  }

  private calculateMonthlyPayment(
    loanAmount: number,
    monthlyRate: number,
    totalMonths: number
  ): number {
    if (monthlyRate === 0) {
      return loanAmount / totalMonths;
    }

    const annuityCoefficient =
      (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    return loanAmount * annuityCoefficient;
  }

  private calculateTaxDeduction(
    propertyPrice: number,
    totalOverpayment: number
  ): number {
    const propertyDeduction = Math.min(propertyPrice, 2000000) * 0.13;

    const interestDeduction = Math.min(totalOverpayment, 3000000) * 0.13;

    return propertyDeduction + interestDeduction;
  }

  private generatePaymentSchedule(
    loanAmount: number,
    monthlyRate: number,
    monthlyPayment: number,
    totalMonths: number
  ): MortgagePaymentSchedule {
    const schedule: MortgagePaymentSchedule = {};
    let remainingBalance = loanAmount;

    for (let month = 1; month <= totalMonths; month++) {
      const monthlyInterest = remainingBalance * monthlyRate;

      const principalPayment = monthlyPayment - monthlyInterest;

      remainingBalance = remainingBalance - principalPayment;

      const payment: MortgagePayment = {
        totalPayment: Math.round(monthlyPayment * 100) / 100,
        repaymentOfMortgageBody: Math.round(principalPayment * 100) / 100,
        repaymentOfMortgageInterest: Math.round(monthlyInterest * 100) / 100,
        mortgageBalance: Math.max(0, Math.round(remainingBalance * 100) / 100)
      };

      const yearNumber = Math.ceil(month / 12);
      const monthNumber = ((month - 1) % 12) + 1;

      const yearKey = `${yearNumber}`;
      const monthKey = `${monthNumber}`;

      if (!schedule[yearKey]) {
        schedule[yearKey] = {};
      }

      schedule[yearKey][monthKey] = payment;
    }

    return schedule;
  }

  private calculateMatCapitalSavings(
    matCapital: number,
    monthlyRate: number,
    totalMonths: number
  ): number {
    const yearlyRate = monthlyRate * 12;
    const averageMonths = totalMonths / 2;
    return matCapital * yearlyRate * (averageMonths / 12);
  }
}
