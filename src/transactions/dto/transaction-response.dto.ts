import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../entities/transaction.entity';

export class TransactionResponseDto {
  @ApiProperty({ description: 'The ID of the transaction' })
  id: string;

  @ApiProperty({ description: 'The amount of the transaction' })
  amount: number;

  @ApiProperty({
    description: 'The type of transaction',
    enum: TransactionType,
  })
  type: TransactionType;

  @ApiProperty({ description: 'The ID of the wallet' })
  walletId: string;

  @ApiProperty({ description: 'The creation date of the transaction' })
  createdAt: Date;
}
