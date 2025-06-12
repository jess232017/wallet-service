import { ApiProperty } from '@nestjs/swagger';
import { TransactionResponseDto } from '../../transactions/dto/transaction-response.dto';

export class WalletResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the wallet',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the wallet',
    example: 'My Savings Wallet',
  })
  name: string;

  @ApiProperty({
    description: 'The current balance of the wallet',
    type: Number,
    example: 1000.0,
  })
  balance: number;

  @ApiProperty({
    description: 'The transactions associated with this wallet',
    type: [TransactionResponseDto],
    isArray: true,
  })
  transactions: TransactionResponseDto[];

  @ApiProperty({
    description: 'The timestamp when the wallet was created',
    example: '2024-03-20T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The timestamp when the wallet was last updated',
    example: '2024-03-20T10:00:00Z',
  })
  updatedAt: Date;
}
