import { Module } from '@nestjs/common';
import { MortgageService } from './services/mortgage.service';
import { MortgageController } from './mortgage.controller';
import { MortgageProfileModule } from './profile/mortgage-profile.module';
import { MortgageCalculationModule } from './calculation/mortgage-calculation.module';

@Module({
  imports: [MortgageProfileModule, MortgageCalculationModule],
  controllers: [MortgageController],
  providers: [MortgageService],
  exports: [MortgageService]
})
export class MortgageModule {}
