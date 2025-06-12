import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateDepositDto } from '../wallets/dto/create-deposit.dto';
import { CreateWithdrawalDto } from '../wallets/dto/create-withdrawal.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the transaction',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<TransactionResponseDto> {
    return this.transactionsService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a deposit transaction' })
  @ApiResponse({
    status: 201,
    description: 'Deposit successful',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  @ApiResponse({ status: 400, description: 'Invalid deposit amount' })
  @Post('wallet/:walletId/deposit')
  deposit(
    @Param('walletId') walletId: string,
    @Body() createDepositDto: CreateDepositDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.createDeposit(
      walletId,
      createDepositDto.amount,
    );
  }

  @ApiOperation({ summary: 'Create a withdrawal transaction' })
  @ApiResponse({
    status: 201,
    description: 'Withdrawal successful',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  @ApiResponse({
    status: 400,
    description: 'Insufficient funds or invalid withdrawal amount',
  })
  @Post('wallet/:walletId/withdraw')
  withdraw(
    @Param('walletId') walletId: string,
    @Body() createWithdrawalDto: CreateWithdrawalDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.createWithdrawal(
      walletId,
      createWithdrawalDto.amount,
    );
  }
}
