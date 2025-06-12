import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../transaction.entity';

export class TransactionResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the transaction',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The amount of the transaction',
    type: Number,
    example: 100.0,
  })
  amount: number;

  @ApiProperty({
    description: 'The type of transaction',
    enum: TransactionType,
    example: TransactionType.DEPOSIT,
  })
  type: TransactionType;

  @ApiProperty({
    description: 'The ID of the wallet associated with this transaction',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  walletId: string;

  @ApiProperty({
    description: 'The timestamp when the transaction was created',
    example: '2024-03-20T10:00:00Z',
  })
  createdAt: Date;
}
