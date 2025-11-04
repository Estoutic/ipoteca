import { Controller, Post, Body, Request } from '@nestjs/common';
import { MortgageService } from './services/mortgage.service';
import { CreateMortgageProfileDto } from './dto/create-mortgage-profile.dto';
import { MortgageCalculationResponse } from './interfaces/mortgage-calculation-response.interface';

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
