import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({
    description: 'The name of the wallet',
    example: 'My Savings Wallet',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'Wallet name is required' })
  @IsString({ message: 'Wallet name must be a string' })
  @MinLength(3, { message: 'Wallet name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Wallet name must not exceed 50 characters' })
  @Matches(/^[a-zA-Z0-9\s-_]+$/, {
    message:
      'Wallet name can only contain letters, numbers, spaces, hyphens, and underscores',
  })
  name: string;
}
