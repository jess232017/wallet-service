import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min, Max, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDepositDto {
  @ApiProperty({
    description: 'The amount to deposit',
    type: Number,
    example: 100.0,
    minimum: 0.01,
    maximum: 1000000.0,
  })
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber({}, { message: 'Amount must be a number' })
  @Type(() => Number)
  @IsPositive({ message: 'Amount must be positive' })
  @Min(0.01, { message: 'Minimum deposit amount is 0.01' })
  @Max(1000000, { message: 'Maximum deposit amount is 1,000,000' })
  amount: number;
}
