import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './transaction.entity';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import {
  IUnitOfWork,
  UNIT_OF_WORK,
} from '../common/interfaces/unit-of-work.interface';
import { Wallet } from '../wallets/wallet.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async findOne(id: string): Promise<TransactionResponseDto> {
    return this.unitOfWork.executeInTransaction(async (entityManager) => {
      const transaction = await entityManager.findOne(Transaction, {
        where: { id },
        relations: ['wallet'],
      });

      if (!transaction) {
        throw new NotFoundException(`Transaction with ID ${id} not found`);
      }

      return {
        id: transaction.id,
        amount: transaction.amount,
        type: transaction.type,
        walletId: transaction.wallet.id,
        createdAt: transaction.createdAt,
      };
    });
  }

  async createDeposit(
    walletId: string,
    amount: number,
  ): Promise<TransactionResponseDto> {
    return this.unitOfWork.executeInTransaction(async (entityManager) => {
      const wallet = await entityManager.findOne(Wallet, {
        where: { id: walletId },
      });
      if (!wallet) {
        throw new NotFoundException(`Wallet with ID ${walletId} not found`);
      }

      // Create transaction record
      const transaction = entityManager.create(Transaction, {
        amount,
        type: TransactionType.DEPOSIT,
        wallet,
      });

      // Update wallet balance
      wallet.balance = Number(wallet.balance) + Number(amount);

      // Save both in the same transaction
      await entityManager.save(Transaction, transaction);
      await entityManager.save(Wallet, wallet);

      return {
        id: transaction.id,
        amount: transaction.amount,
        type: transaction.type,
        walletId: wallet.id,
        createdAt: transaction.createdAt,
      };
    });
  }

  async createWithdrawal(
    walletId: string,
    amount: number,
  ): Promise<TransactionResponseDto> {
    return this.unitOfWork.executeInTransaction(async (entityManager) => {
      const wallet = await entityManager.findOne(Wallet, {
        where: { id: walletId },
      });
      if (!wallet) {
        throw new NotFoundException(`Wallet with ID ${walletId} not found`);
      }

      if (Number(wallet.balance) < Number(amount)) {
        throw new BadRequestException('Insufficient funds');
      }

      // Create transaction record
      const transaction = entityManager.create(Transaction, {
        amount,
        type: TransactionType.WITHDRAWAL,
        wallet,
      });

      // Update wallet balance
      wallet.balance = Number(wallet.balance) - Number(amount);

      // Save both in the same transaction
      await entityManager.save(Transaction, transaction);
      await entityManager.save(Wallet, wallet);

      return {
        id: transaction.id,
        amount: transaction.amount,
        type: transaction.type,
        walletId: wallet.id,
        createdAt: transaction.createdAt,
      };
    });
  }
}
