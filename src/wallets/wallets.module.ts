import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { Wallet } from './entities/wallet.entity';
import { TransactionsModule } from '../transactions/transactions.module';
import { WalletRepository } from './repositories/wallet.repository';
import { UnitOfWorkModule } from '../common/unit-of-work/unit-of-work.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    TransactionsModule,
    UnitOfWorkModule,
  ],
  controllers: [WalletsController],
  providers: [WalletsService, WalletRepository],
  exports: [WalletsService],
})
export class WalletsModule {}
