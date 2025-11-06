import { Injectable } from '@nestjs/common';
import { MortgageCalculationResponse } from '../calculation/interface/mortgage-calculation-response.interface';
import { MortgageCalculationService } from '../calculation/services/mortgage-calculation.service';
import { MortgageProfileService } from '../profile/services/mortgage-profile.service';
import { CreateMortgageProfileDto } from '../profile/dto/create-mortgage-profile.dto';

@Injectable()
export class MortgageService {
  constructor(
    private readonly profileService: MortgageProfileService,
    private readonly calculationService: MortgageCalculationService,
    private readonly calculator: MortgageCalculationService
  ) {}

  async create(
    dto: CreateMortgageProfileDto,
    userId: string
  ): Promise<MortgageCalculationResponse> {
    const profileId = await this.profileService.create(dto, userId);

    const calculationResult = this.calculator.calculate(dto);

    await this.calculationService.create(calculationResult, userId, profileId);

    return calculationResult;
  }
}
