import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWalletDto {
  @ApiProperty({ description: 'The name of the wallet', required: false })
  @IsString()
  @IsOptional()
  name?: string;
}
