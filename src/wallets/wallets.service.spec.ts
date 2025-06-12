import { Test, TestingModule } from '@nestjs/testing';
import { WalletsService } from './wallets.service';
import { WalletRepository } from './repositories/wallet.repository';
import { TransactionsService } from '../transactions/transactions.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { NotFoundException } from '@nestjs/common';
import { Wallet } from './entities/wallet.entity';

// Mock the repository
class MockWalletRepository {
  create = jest.fn();
  findAll = jest.fn();
  findOne = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

// Mock the transactions service
class MockTransactionsService {}

describe('WalletsService', () => {
  let service: WalletsService;
  let walletRepository: MockWalletRepository;

  const mockWallet: Wallet = {
    id: '1',
    name: 'Test Wallet',
    balance: 100,
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    transactions: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletsService,
        {
          provide: WalletRepository,
          useClass: MockWalletRepository, // Usar la clase mockeada
        },
        {
          provide: TransactionsService,
          useClass: MockTransactionsService,
        },
      ],
    }).compile();

    service = module.get<WalletsService>(WalletsService);
    walletRepository = module.get(WalletRepository);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new wallet', async () => {
      const createWalletDto: CreateWalletDto = { name: 'New Wallet' };
      walletRepository.create.mockResolvedValue(mockWallet);

      const result = await service.create(createWalletDto);

      expect(walletRepository.create).toHaveBeenCalledWith({
        name: createWalletDto.name,
        balance: 0,
      });
      expect(result).toBeDefined();
      expect(result.id).toBe(mockWallet.id);
      expect(result.name).toBe(mockWallet.name);
    });
  });

  describe('findAll', () => {
    it('should return an array of wallets', async () => {
      walletRepository.findAll.mockResolvedValue([mockWallet]);

      const result = await service.findAll();

      expect(walletRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockWallet.id);
    });
  });

  describe('findOne', () => {
    it('should return a wallet by id', async () => {
      walletRepository.findOne.mockResolvedValue(mockWallet);

      const result = await service.findOne('1');

      expect(walletRepository.findOne).toHaveBeenCalledWith('1');
      expect(result.id).toBe(mockWallet.id);
    });

    it('should throw NotFoundException when wallet is not found', async () => {
      walletRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getBalance', () => {
    it('should return wallet balance', async () => {
      walletRepository.findOne.mockResolvedValue(mockWallet);

      const result = await service.getBalance('1');

      expect(result).toEqual({
        walletId: mockWallet.id,
        balance: mockWallet.balance,
      });
    });

    it('should throw NotFoundException when wallet is not found', async () => {
      walletRepository.findOne.mockResolvedValue(null);

      await expect(service.getBalance('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a wallet', async () => {
      const updateWalletDto: UpdateWalletDto = { name: 'Updated Wallet' };
      const updatedWallet = { ...mockWallet, name: 'Updated Wallet' };
      walletRepository.findOne.mockResolvedValue(mockWallet);
      walletRepository.update.mockResolvedValue(updatedWallet);

      const result = await service.update('1', updateWalletDto);

      expect(walletRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockWallet,
          name: 'Updated Wallet',
        }),
      );
      expect(result).toBeDefined();
      expect(result.name).toBe('Updated Wallet');
    });

    it('should throw NotFoundException when wallet is not found', async () => {
      walletRepository.findOne.mockResolvedValue(null);

      await expect(service.update('999', { name: 'Updated' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a wallet', async () => {
      walletRepository.findOne.mockResolvedValue(mockWallet);
      walletRepository.delete.mockResolvedValue(undefined);

      await service.remove('1');

      expect(walletRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when wallet is not found', async () => {
      walletRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
