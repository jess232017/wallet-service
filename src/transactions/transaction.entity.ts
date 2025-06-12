import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Wallet } from '../wallets/wallet.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

@Entity()
export class Transaction {
  @ApiProperty({ description: 'The unique identifier of the transaction' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The amount of the transaction',
    type: Number,
    example: 100.0,
  })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'The type of transaction',
    enum: TransactionType,
    example: TransactionType.DEPOSIT,
  })
  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @ApiProperty({
    description: 'The wallet associated with this transaction',
    type: () => Wallet,
  })
  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, {
    onDelete: 'CASCADE',
  })
  wallet: Wallet;

  @ApiProperty({
    description: 'The timestamp when the transaction was created',
  })
  @CreateDateColumn()
  createdAt: Date;
}
