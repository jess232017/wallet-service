import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { Wallet } from './wallet.entity';
import { UnitOfWorkModule } from '../common/unit-of-work/unit-of-work.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), UnitOfWorkModule],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
