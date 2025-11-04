import { Module } from '@nestjs/common';
import { MortgageService } from './services/mortgage.service';
import { MortgageCalculatorHelper } from './services/mortgage-calculator.service';
import { MortgageController } from './mortgage.controller';

@Module({
  controllers: [MortgageController],
  providers: [MortgageService, MortgageCalculatorHelper],
  exports: [MortgageService, MortgageCalculatorHelper]
})
export class MortgageModule {}
