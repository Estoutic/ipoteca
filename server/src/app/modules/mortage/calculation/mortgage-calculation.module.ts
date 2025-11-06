import { Module } from '@nestjs/common';
import { MortgageCalculationService } from './services/mortgage-calculation.service';

@Module({
  providers: [MortgageCalculationService],
  exports: [MortgageCalculationService]
})
export class MortgageCalculationModule {}
