import { Controller, Post, Body, Request } from '@nestjs/common';
import { MortgageService } from './services/mortgage.service';
import { MortgageCalculationResponse } from './calculation/interface/mortgage-calculation-response.interface';
import { CreateMortgageProfileDto } from './profile/dto/create-mortgage-profile.dto';

@Controller('mortgage')
export class MortgageController {
  constructor(private readonly mortgageService: MortgageService) {}

  @Post('calculate')
  //TODO накинуть авторизацию
  async create(
    @Body() dto: CreateMortgageProfileDto,
    @Request() req: any
  ): Promise<MortgageCalculationResponse> {
    const userId = req.user?.tgId || crypto.randomUUID();

    return this.mortgageService.create(dto, userId);
  }
}
