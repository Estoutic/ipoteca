import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Database } from 'src/database/schema';
import { mortgageProfiles } from '../schemas/mortgage-profile.schema';
import { CreateMortgageProfileDto } from '../dto/create-mortgage-profile.dto';

@Injectable()
export class MortgageProfileService {
  constructor(@Inject('DATABASE') private readonly db: Database) {}

  async create(dto: CreateMortgageProfileDto, userId: string): Promise<string> {
    this.validateInput(dto);

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

    return profileId;
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