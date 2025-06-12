import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { BalanceResponseDto } from './dto/balance-response.dto';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletRepository } from './repositories/wallet.repository';
import { WalletResponseDto } from './dto/wallet-response.dto';
import { WalletMapper } from './mappers/wallet.mapper';

@Injectable()
export class WalletsService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly transactionsService: TransactionsService,
  ) {}

  async create(createWalletDto: CreateWalletDto): Promise<WalletResponseDto> {
    const wallet = await this.walletRepository.create({
      name: createWalletDto.name,
      balance: 0, // Always start with 0 balance
    });
    return WalletMapper.toDto(wallet);
  }

  async findAll(): Promise<WalletResponseDto[]> {
    const wallets = await this.walletRepository.findAll();
    return wallets.map((wallet) => WalletMapper.toDto(wallet));
  }

  async findOne(id: string): Promise<WalletResponseDto> {
    const wallet = await this.walletRepository.findOne(id);
    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }
    return WalletMapper.toDto(wallet);
  }

  async getBalance(id: string): Promise<BalanceResponseDto> {
    const wallet = await this.findOne(id);
    return {
      walletId: wallet.id,
      balance: wallet.balance,
    };
  }

  async update(
    id: string,
    updateWalletDto: UpdateWalletDto,
  ): Promise<WalletResponseDto> {
    const wallet = await this.walletRepository.findOne(id);
    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }
    Object.assign(wallet, updateWalletDto);
    const updatedWallet = await this.walletRepository.update(wallet);
    return WalletMapper.toDto(updatedWallet);
  }

  async remove(id: string): Promise<void> {
    const wallet = await this.walletRepository.findOne(id);
    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }
    await this.walletRepository.delete(id);
  }
}
