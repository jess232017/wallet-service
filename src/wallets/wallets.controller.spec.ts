import { Test, TestingModule } from '@nestjs/testing';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from '../transactions/dto/create-wallet.dto';
import { WalletResponseDto } from './dto/wallet-response.dto';
import { BalanceResponseDto } from './dto/balance-response.dto';

// Mock the service
class MockWalletsService {
  create = jest.fn();
  findAll = jest.fn();
  findOne = jest.fn();
  getBalance = jest.fn();
}

describe('WalletsController', () => {
  let controller: WalletsController;
  let walletsService: MockWalletsService;

  const mockWalletResponse: WalletResponseDto = {
    id: '1',
    name: 'Test Wallet',
    balance: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBalanceResponse: BalanceResponseDto = {
    walletId: '1',
    balance: 100,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletsController],
      providers: [
        {
          provide: WalletsService,
          useClass: MockWalletsService,
        },
      ],
    }).compile();

    controller = module.get<WalletsController>(WalletsController);
    walletsService = module.get(WalletsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new wallet', async () => {
      const createWalletDto: CreateWalletDto = { name: 'New Wallet' };
      walletsService.create.mockResolvedValue(mockWalletResponse);

      const result = await controller.create(createWalletDto);

      expect(walletsService.create).toHaveBeenCalledWith(createWalletDto);
      expect(result).toBe(mockWalletResponse);
    });
  });

  describe('findAll', () => {
    it('should return an array of wallets', async () => {
      walletsService.findAll.mockResolvedValue([mockWalletResponse]);

      const result = await controller.findAll();

      expect(walletsService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockWalletResponse]);
    });
  });

  describe('findOne', () => {
    it('should return a wallet by id', async () => {
      walletsService.findOne.mockResolvedValue(mockWalletResponse);

      const result = await controller.findOne('1');

      expect(walletsService.findOne).toHaveBeenCalledWith('1');
      expect(result).toBe(mockWalletResponse);
    });
  });

  describe('getBalance', () => {
    it('should return wallet balance', async () => {
      walletsService.getBalance.mockResolvedValue(mockBalanceResponse);

      const result = await controller.getBalance('1');

      expect(walletsService.getBalance).toHaveBeenCalledWith('1');
      expect(result).toBe(mockBalanceResponse);
    });
  });
});
