import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { TransactionRepository } from './repositories/transaction.repository';
import { WalletRepository } from '../wallets/repositories/wallet.repository';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { Wallet } from '../wallets/entities/wallet.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UNIT_OF_WORK } from '../common/constants';
import { IUnitOfWork } from '../common/interfaces/unit-of-work.interface';
import { EntityManager } from 'typeorm';

// Mock the repositories
class MockTransactionRepository {
  create = jest.fn();
  findAll = jest.fn();
  findOne = jest.fn();
  findByWalletId = jest.fn();
  findOneWithWallet = jest.fn();
}

class MockWalletRepository {
  findOne = jest.fn();
  update = jest.fn();
}

// Mock the unit of work
class MockUnitOfWork implements IUnitOfWork {
  executeInTransaction = jest
    .fn()
    .mockImplementation(
      <T>(callback: (entityManager: EntityManager) => Promise<T>): Promise<T> =>
        callback({} as EntityManager),
    );
  getEntityManager = jest.fn();
}

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionRepository: MockTransactionRepository;
  let walletRepository: MockWalletRepository;

  const mockWallet: Wallet = {
    id: '1',
    name: 'Test Wallet',
    balance: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    transactions: [],
  };

  const mockTransaction: Transaction = {
    id: '1',
    amount: 100,
    type: TransactionType.DEPOSIT,
    walletId: '1',
    wallet: mockWallet,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionRepository,
          useClass: MockTransactionRepository,
        },
        {
          provide: WalletRepository,
          useClass: MockWalletRepository,
        },
        {
          provide: UNIT_OF_WORK,
          useClass: MockUnitOfWork,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionRepository = module.get(TransactionRepository);
    walletRepository = module.get(WalletRepository);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const createTransactionDto: CreateTransactionDto = {
        walletId: '1',
        amount: 100,
        type: TransactionType.DEPOSIT,
      };
      transactionRepository.create.mockResolvedValue(mockTransaction);

      const result = await service.create(createTransactionDto);

      expect(transactionRepository.create).toHaveBeenCalledWith(
        createTransactionDto,
      );
      expect(result).toBe(mockTransaction);
    });
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      transactionRepository.findAll.mockResolvedValue([mockTransaction]);

      const result = await service.findAll();

      expect(transactionRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockTransaction.id);
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      transactionRepository.findOne.mockResolvedValue(mockTransaction);

      const result = await service.findOne('1');

      expect(transactionRepository.findOne).toHaveBeenCalledWith('1');
      expect(result.id).toBe(mockTransaction.id);
    });

    it('should throw NotFoundException when transaction is not found', async () => {
      transactionRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByWalletId', () => {
    it('should return transactions for a wallet', async () => {
      transactionRepository.findByWalletId.mockResolvedValue([mockTransaction]);

      const result = await service.findByWalletId('1');

      expect(transactionRepository.findByWalletId).toHaveBeenCalledWith('1');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockTransaction.id);
    });
  });

  describe('findOneTransaction', () => {
    it('should return a transaction with wallet details', async () => {
      transactionRepository.findOneWithWallet.mockResolvedValue(
        mockTransaction,
      );

      const result = await service.findOneTransaction('1');

      expect(transactionRepository.findOneWithWallet).toHaveBeenCalledWith('1');
      expect(result.id).toBe(mockTransaction.id);
    });

    it('should throw NotFoundException when transaction is not found', async () => {
      transactionRepository.findOneWithWallet.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(service.findOneTransaction('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createDeposit', () => {
    it('should create a deposit transaction', async () => {
      walletRepository.findOne.mockResolvedValue(mockWallet);
      transactionRepository.create.mockResolvedValue(mockTransaction);
      const updatedWallet = { ...mockWallet, balance: 200 };
      walletRepository.update.mockResolvedValue(updatedWallet);

      const result = await service.createDeposit('1', 100);

      expect(walletRepository.findOne).toHaveBeenCalledWith(
        '1',
        expect.anything(),
      );
      expect(transactionRepository.create).toHaveBeenCalledWith(
        {
          amount: 100,
          type: TransactionType.DEPOSIT,
          wallet: mockWallet,
        },
        expect.anything(),
      );
      expect(walletRepository.update).toHaveBeenCalledWith(
        updatedWallet,
        expect.anything(),
      );
      expect(result.id).toBe(mockTransaction.id);
    });

    it('should throw NotFoundException when wallet is not found', async () => {
      walletRepository.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.createDeposit('999', 100)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for invalid deposit amount', async () => {
      walletRepository.findOne.mockResolvedValue(mockWallet);

      await expect(service.createDeposit('1', 0)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createDeposit('1', -100)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('createWithdrawal', () => {
    it('should create a withdrawal transaction', async () => {
      const mockWalletWithBalance = { ...mockWallet, balance: 100 };
      walletRepository.findOne.mockResolvedValue(mockWalletWithBalance);
      const withdrawalTransaction = {
        ...mockTransaction,
        amount: -50,
        type: TransactionType.WITHDRAWAL,
      };
      const updatedWallet = { ...mockWalletWithBalance, balance: 50 };
      transactionRepository.create.mockResolvedValue(withdrawalTransaction);
      walletRepository.update.mockResolvedValue(updatedWallet);

      const result = await service.createWithdrawal('1', 50);

      expect(walletRepository.findOne).toHaveBeenCalledWith(
        '1',
        expect.anything(),
      );
      expect(transactionRepository.create).toHaveBeenCalledWith(
        {
          amount: -50,
          type: TransactionType.WITHDRAWAL,
          wallet: mockWalletWithBalance,
        },
        expect.anything(),
      );
      expect(walletRepository.update).toHaveBeenCalledWith(
        updatedWallet,
        expect.anything(),
      );
      expect(result.id).toBe(withdrawalTransaction.id);
    });

    it('should throw NotFoundException when wallet is not found', async () => {
      walletRepository.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.createWithdrawal('999', 50)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for invalid withdrawal amount', async () => {
      walletRepository.findOne.mockResolvedValue(mockWallet);

      await expect(service.createWithdrawal('1', 0)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createWithdrawal('1', -50)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for insufficient funds', async () => {
      const lowBalanceWallet = { ...mockWallet, balance: 100 };
      walletRepository.findOne.mockResolvedValue(lowBalanceWallet);

      await expect(service.createWithdrawal('1', 200)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
