import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Wallet } from '../wallets/wallet.entity';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, {
    onDelete: 'CASCADE',
  })
  wallet: Wallet;
}
