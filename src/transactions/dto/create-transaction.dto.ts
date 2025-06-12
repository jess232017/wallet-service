import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @ApiProperty({ description: 'The ID of the wallet' })
  @IsString()
  walletId: string;

  @ApiProperty({ description: 'The amount of the transaction' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'The type of transaction',
    enum: TransactionType,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'Description of the transaction',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
