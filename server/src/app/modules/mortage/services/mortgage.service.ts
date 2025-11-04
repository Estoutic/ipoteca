import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Database } from 'src/database/schema';
import { CreateMortgageProfileDto } from '../dto/create-mortgage-profile.dto';
import { MortgageCalculatorHelper } from './mortgage-calculator.service';
import { MortgageCalculationResponse } from '../interfaces/mortgage-calculation-response.interface';
import { mortgageProfiles } from '../schemas/mortgage-profile';
import { mortgageCalculations } from '../schemas/mortgage-calculation';

@Injectable()
export class MortgageService {
  constructor(
    @Inject('DATABASE') private readonly db: Database,
    private readonly calculator: MortgageCalculatorHelper
  ) {}

  async create(
    dto: CreateMortgageProfileDto,
    userId: string
  ): Promise<MortgageCalculationResponse> {
    this.validateInput(dto);

    const calculationResult = this.calculator.calculate(dto);

    const profileId = crypto.randomUUID();
    const profileData = {
      id: profileId,
      userId,
      propertyPrice: dto.propertyPrice.toString(),
      propertyType: dto.propertyType,
      downPaymentAmount: dto.downPaymentAmount.toString(),
      matCapitalAmount: dto.matCapitalAmount
        ? dto.matCapitalAmount.toString()
        : null,
      matCapitalIncluded: dto.matCapitalIncluded,
      loanTermYears: dto.loanTermYears,
      interestRate: dto.interestRate.toString()
    };

    await this.db.insert(mortgageProfiles).values(profileData);

    const calculationId = crypto.randomUUID();
    const calculationData = {
      id: calculationId,
      userId,
      mortgageProfileId: profileId,
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

    return calculationResult;
  }

  private validateInput(dto: CreateMortgageProfileDto): void {
    if (dto.downPaymentAmount >= dto.propertyPrice) {
      throw new BadRequestException(
        'The down payment cannot be greater than or equal to the value of the property.'
      );
    }

    const matCapital =
      dto.matCapitalIncluded && dto.matCapitalAmount ? dto.matCapitalAmount : 0;
    if (dto.downPaymentAmount + matCapital >= dto.propertyPrice) {
      throw new BadRequestException(
        'The amount of the down payment and maternity capital cannot be greater than or equal to the value of the property.'
      );
    }
  }
}
