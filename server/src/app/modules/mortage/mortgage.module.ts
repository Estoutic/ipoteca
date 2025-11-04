import { Module } from '@nestjs/common';
import { MortgageService } from './services/mortgage.service';
import { MortgageCalculatorService } from './services/mortgage-calculator.service';
import { MortgageController } from './mortgage.controller';

@Module({
  controllers: [MortgageController],
  providers: [MortgageService, MortgageCalculatorService],
  exports: [MortgageService, MortgageCalculatorService]
})
export class MortgageModule {}
