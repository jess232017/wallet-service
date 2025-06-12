import { ApiProperty } from '@nestjs/swagger';

export class BalanceResponseDto {
  @ApiProperty({ description: 'The ID of the wallet' })
  walletId: string;

  @ApiProperty({ description: 'The current balance of the wallet' })
  balance: number;
}
