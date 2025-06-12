import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { Wallet } from './entities/wallet.entity';
import { TransactionsModule } from '../transactions/transactions.module';
import { WalletRepository } from './repositories/wallet.repository';
import { UNIT_OF_WORK } from '../common/constants';
import { TypeOrmUnitOfWork } from '../common/unit-of-work/typeorm-unit-of-work';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), TransactionsModule],
  controllers: [WalletsController],
  providers: [
    WalletsService,
    WalletRepository,
    {
      provide: UNIT_OF_WORK,
      useClass: TypeOrmUnitOfWork,
    },
  ],
  exports: [WalletsService],
})
export class WalletsModule {}
