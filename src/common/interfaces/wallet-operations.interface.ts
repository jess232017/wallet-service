import { Wallet } from '../../wallets/entities/wallet.entity';

export interface IWalletOperations {
  findOne(id: string): Promise<Wallet>;
  updateBalance(id: string, amount: number): Promise<void>;
}
