import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionRepository } from './repositories/transaction.repository';
import { WalletRepository } from '../wallets/repositories/wallet.repository';
import { TransactionMapper } from './mappers/transaction.mapper';
import { UNIT_OF_WORK } from '../common/constants';
import { IUnitOfWork } from '../common/interfaces/unit-of-work.interface';
import { OptimisticLockVersionMismatchError } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletRepository: WalletRepository,
    @Inject(UNIT_OF_WORK)
    private readonly uow: IUnitOfWork,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionRepository.create(createTransactionDto);
  }

  async findAll(): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionRepository.findAll();
    return transactions.map((transaction) =>
      TransactionMapper.toDto(transaction),
    );
  }

  async findOne(id: string): Promise<TransactionResponseDto> {
    const transaction = await this.transactionRepository.findOne(id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return TransactionMapper.toDto(transaction);
  }

  async findByWalletId(walletId: string): Promise<TransactionResponseDto[]> {
    const transactions =
      await this.transactionRepository.findByWalletId(walletId);
    return transactions.map((transaction) =>
      TransactionMapper.toDto(transaction),
    );
  }

  async findOneTransaction(id: string): Promise<TransactionResponseDto> {
    const transaction = await this.transactionRepository.findOneWithWallet(id);

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return {
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type,
      walletId: transaction.walletId,
      createdAt: transaction.createdAt,
    };
  }

  async createDeposit(
    walletId: string,
    amount: number,
  ): Promise<TransactionResponseDto> {
    try {
      return await this.uow.executeInTransaction(async (entityManager) => {
        const wallet = await this.walletRepository.findOne(
          walletId,
          entityManager,
        );
        if (!wallet) {
          throw new NotFoundException(`Wallet with ID ${walletId} not found`);
        }

        if (amount <= 0) {
          throw new BadRequestException(
            'Deposit amount must be greater than 0',
          );
        }

        const transaction = await this.transactionRepository.create(
          {
            amount,
            type: TransactionType.DEPOSIT,
            wallet,
          },
          entityManager,
        );

        wallet.balance = Number(wallet.balance) + Number(amount);
        await this.walletRepository.update(wallet, entityManager);

        return TransactionMapper.toDto(transaction);
      });
    } catch (error) {
      if (error instanceof OptimisticLockVersionMismatchError) {
        throw new BadRequestException(
          'Another operation is pending on this wallet. Please try again.',
        );
      }
      throw error;
    }
  }

  async createWithdrawal(
    walletId: string,
    amount: number,
  ): Promise<TransactionResponseDto> {
    try {
      return await this.uow.executeInTransaction(async (entityManager) => {
        const wallet = await this.walletRepository.findOne(
          walletId,
          entityManager,
        );
        if (!wallet) {
          throw new NotFoundException(`Wallet with ID ${walletId} not found`);
        }

        if (amount <= 0) {
          throw new BadRequestException(
            'Withdrawal amount must be greater than 0',
          );
        }

        if (Number(wallet.balance) < amount) {
          throw new BadRequestException('Insufficient funds');
        }

        const transaction = await this.transactionRepository.create(
          {
            amount: -amount,
            type: TransactionType.WITHDRAWAL,
            wallet,
          },
          entityManager,
        );

        wallet.balance = Number(wallet.balance) - Number(amount);
        await this.walletRepository.update(wallet, entityManager);

        return TransactionMapper.toDto(transaction);
      });
    } catch (error) {
      if (error instanceof OptimisticLockVersionMismatchError) {
        throw new BadRequestException(
          'Another operation is pending on this wallet. Please try again.',
        );
      }
      throw error;
    }
  }
}
