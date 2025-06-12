import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { CreateWalletDto } from '../transactions/dto/create-wallet.dto';
import { WalletResponseDto } from './dto/wallet-response.dto';
import { BalanceResponseDto } from './dto/balance-response.dto';
import {
  IUnitOfWork,
  UNIT_OF_WORK,
} from '../common/interfaces/unit-of-work.interface';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletsRepository: Repository<Wallet>,
    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async create(createWalletDto: CreateWalletDto): Promise<WalletResponseDto> {
    return this.unitOfWork.executeInTransaction(async (entityManager) => {
      const wallet = entityManager.create(Wallet, {
        name: createWalletDto.name,
        balance: 0, // Always start with 0 balance
      });
      return entityManager.save(Wallet, wallet);
    });
  }

  async findAll(): Promise<WalletResponseDto[]> {
    return this.unitOfWork.executeInTransaction(async (entityManager) => {
      return entityManager.find(Wallet);
    });
  }

  async findOne(id: string): Promise<WalletResponseDto> {
    return this.unitOfWork.executeInTransaction(async (entityManager) => {
      const wallet = await entityManager.findOne(Wallet, { where: { id } });
      if (!wallet) {
        throw new NotFoundException(`Wallet with ID ${id} not found`);
      }
      return wallet;
    });
  }

  async getBalance(id: string): Promise<BalanceResponseDto> {
    return this.unitOfWork.executeInTransaction(async (entityManager) => {
      const wallet = await entityManager.findOne(Wallet, { where: { id } });
      if (!wallet) {
        throw new NotFoundException(`Wallet with ID ${id} not found`);
      }
      return {
        walletId: wallet.id,
        balance: Number(wallet.balance),
      };
    });
  }
}
