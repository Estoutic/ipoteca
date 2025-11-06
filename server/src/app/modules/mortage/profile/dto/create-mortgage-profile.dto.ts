import {
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  Max,
  IsEnum,
  IsDateString
} from 'class-validator';
import { PropertyType } from '../enum/property-type.enum';

export class CreateMortgageProfileDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  propertyPrice: number;

  @IsNotEmpty()
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  downPaymentAmount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  matCapitalAmount?: number;

  @IsNotEmpty()
  @IsBoolean()
  matCapitalIncluded: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(50)
  loanTermYears: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  interestRate: number;

  @IsNotEmpty()
  @IsDateString()
  calculationDate: string;
}