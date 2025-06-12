import { Transaction } from '../entities/transaction.entity';
import { TransactionResponseDto } from '../dto/transaction-response.dto';

export class TransactionMapper {
  static toDto(transaction: Transaction): TransactionResponseDto {
    return {
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type,
      walletId: transaction.wallet.id,
      createdAt: transaction.createdAt,
    };
  }
}
