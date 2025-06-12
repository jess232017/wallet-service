import { Wallet } from '../entities/wallet.entity';
import { WalletResponseDto } from '../dto/wallet-response.dto';

export class WalletMapper {
  static toDto(wallet: Wallet): WalletResponseDto {
    const dto = new WalletResponseDto();
    dto.id = wallet.id;
    dto.name = wallet.name;
    dto.balance = Number(wallet.balance);
    dto.createdAt = wallet.createdAt;
    dto.updatedAt = wallet.updatedAt;
    return dto;
  }
}
