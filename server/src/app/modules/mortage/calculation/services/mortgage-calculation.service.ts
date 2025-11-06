import { Injectable, Inject } from '@nestjs/common';
import { Database } from 'src/database/schema';
import { mortgageCalculations } from '../schemas/mortgage-calculation.schema';
import { MortgageCalculationResponse } from '../interface/mortgage-calculation-response.interface';
import { CreateMortgageProfileDto } from '../../profile/dto/create-mortgage-profile.dto';
import {
  MortgagePayment,
  MortgagePaymentSchedule
} from '../interface/mortgage-payment.interface';
import { log } from 'console';

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
      totalMonths,
      dto.calculationDate
    );

    const savingsDueMotherCapital =
      matCapital > 0
        ? this.calculateMatCapitalSavings(matCapital, monthlyRate, totalMonths)
        : 0;

    const recommendedIncome = monthlyPayment / 0.4;

    return {
      monthlyPayment: Number(monthlyPayment.toFixed(2)),
      totalPayment: Number(totalPayment.toFixed(2)),
      totalOverpaymentAmount: Number(totalOverpaymentAmount.toFixed(2)),
      possibleTaxDeduction: Number(possibleTaxDeduction.toFixed(2)),
      savingsDueMotherCapital: Number(savingsDueMotherCapital.toFixed(2)),
      recommendedIncome: Number(recommendedIncome.toFixed(2)),
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
    totalMonths: number,
    calculationDate: string
  ): MortgagePaymentSchedule {
    const schedule: MortgagePaymentSchedule = {};
    let remainingBalance = loanAmount;

    const startDate = new Date(calculationDate);

    for (let month = 1; month <= totalMonths; month++) {
      const monthlyInterest = remainingBalance * monthlyRate;

      const principalPayment = monthlyPayment - monthlyInterest;

      remainingBalance = remainingBalance - principalPayment;

      const payment: MortgagePayment = {
        totalPayment: Number(monthlyPayment.toFixed(2)),
        repaymentOfMortgageBody: Number(principalPayment.toFixed(2)),
        repaymentOfMortgageInterest: Number(monthlyInterest.toFixed(2)),
        mortgageBalance: Math.max(0, Number(remainingBalance.toFixed(2)))
      };

      const year = startDate.getFullYear().toString();
      const monthName = this.getMonthName(startDate.getMonth());

      startDate.setMonth(startDate.getMonth() + 1);

      if (!schedule[year]) {
        schedule[year] = {};
      }

      schedule[year][monthName] = payment;
    }

    return schedule;
  }

  private getMonthName(monthIndex: number): string {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    return monthNames[monthIndex];
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
