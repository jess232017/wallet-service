import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletDto {
  @ApiProperty({ description: 'The name of the wallet' })
  @IsString()
  name: string;
}
