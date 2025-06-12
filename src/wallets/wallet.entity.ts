import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Wallet {
  @ApiProperty({ description: 'The unique identifier of the wallet' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the wallet',
    example: 'My Savings Wallet',
  })
  @Column({ length: 50 })
  name: string;

  @ApiProperty({
    description: 'The current balance of the wallet',
    type: Number,
    example: 1000.0,
  })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number;

  @ApiProperty({
    description: 'The transactions associated with this wallet',
    type: [Transaction],
  })
  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];

  @ApiProperty({ description: 'The timestamp when the wallet was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The timestamp when the wallet was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
