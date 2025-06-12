import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './entities/transaction.entity';
import { UnitOfWorkModule } from '../common/unit-of-work/unit-of-work.module';
import { TransactionRepository } from './repositories/transaction.repository';
import { Wallet } from '../wallets/entities/wallet.entity';
import { WalletRepository } from '../wallets/repositories/wallet.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Wallet]), UnitOfWorkModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionRepository, WalletRepository],
  exports: [TransactionsService],
})
export class TransactionsModule {}
