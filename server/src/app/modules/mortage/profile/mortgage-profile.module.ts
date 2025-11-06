import { Module } from '@nestjs/common';
import { MortgageProfileService } from './services/mortgage-profile.service';

@Module({
  providers: [MortgageProfileService],
  exports: [MortgageProfileService]
})
export class MortgageProfileModule {}