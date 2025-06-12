import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateWalletDto } from '../transactions/dto/create-wallet.dto';
import { WalletResponseDto } from './dto/wallet-response.dto';
import { BalanceResponseDto } from './dto/balance-response.dto';
import { UUIDValidationPipe } from '../common/pipes/uuid-validation.pipe';

@ApiTags('wallets')
@ApiBearerAuth()
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @ApiOperation({ summary: 'Create a new wallet' })
  @ApiResponse({
    status: 201,
    description: 'Wallet created successfully',
    type: WalletResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @Post()
  create(@Body() createWalletDto: CreateWalletDto): Promise<WalletResponseDto> {
    return this.walletsService.create(createWalletDto);
  }

  @ApiOperation({ summary: 'Get all wallets' })
  @ApiResponse({
    status: 200,
    description: 'Return all wallets',
    type: [WalletResponseDto],
  })
  @Get()
  findAll(): Promise<WalletResponseDto[]> {
    return this.walletsService.findAll();
  }

  @ApiOperation({ summary: 'Get a wallet by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the wallet',
    type: WalletResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  @Get(':id')
  findOne(
    @Param('id', UUIDValidationPipe) id: string,
  ): Promise<WalletResponseDto> {
    return this.walletsService.findOne(id);
  }

  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiResponse({
    status: 200,
    description: 'Return the wallet balance',
    type: BalanceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  @Get(':id/balance')
  getBalance(
    @Param('id', UUIDValidationPipe) id: string,
  ): Promise<BalanceResponseDto> {
    return this.walletsService.getBalance(id);
  }
}
