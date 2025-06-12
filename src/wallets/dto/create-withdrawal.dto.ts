import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min, Max, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWithdrawalDto {
  @ApiProperty({
    description: 'The amount to withdraw',
    type: Number,
    example: 50.0,
    minimum: 0.01,
    maximum: 1000000.0,
  })
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber({}, { message: 'Amount must be a number' })
  @Type(() => Number)
  @IsPositive({ message: 'Amount must be positive' })
  @Min(0.01, { message: 'Minimum withdrawal amount is 0.01' })
  @Max(1000000, { message: 'Maximum withdrawal amount is 1,000,000' })
  amount: number;
}
