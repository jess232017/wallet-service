import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './transaction.entity';
import { UnitOfWorkModule } from '../common/unit-of-work/unit-of-work.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), UnitOfWorkModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
