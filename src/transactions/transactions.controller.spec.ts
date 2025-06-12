import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateDepositDto } from '../wallets/dto/create-deposit.dto';
import { CreateWithdrawalDto } from '../wallets/dto/create-withdrawal.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { TransactionType } from './entities/transaction.entity';

// Mock the service
class MockTransactionsService {
  findOne = jest.fn();
  createDeposit = jest.fn();
  createWithdrawal = jest.fn();
}

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let transactionsService: MockTransactionsService;

  const mockTransactionResponse: TransactionResponseDto = {
    id: '1',
    walletId: '1',
    type: TransactionType.DEPOSIT,
    amount: 100,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useClass: MockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    transactionsService = module.get(TransactionsService);
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      transactionsService.findOne.mockResolvedValue(mockTransactionResponse);

      const result = await controller.findOne('1');

      expect(transactionsService.findOne).toHaveBeenCalledWith('1');
      expect(result).toBe(mockTransactionResponse);
    });
  });

  describe('deposit', () => {
    it('should create a deposit transaction', async () => {
      const walletId = '1';
      const createDepositDto: CreateDepositDto = { amount: 100 };
      transactionsService.createDeposit.mockResolvedValue(
        mockTransactionResponse,
      );

      const result = await controller.deposit(walletId, createDepositDto);

      expect(transactionsService.createDeposit).toHaveBeenCalledWith(
        walletId,
        createDepositDto.amount,
      );
      expect(result).toBe(mockTransactionResponse);
    });
  });

  describe('withdraw', () => {
    it('should create a withdrawal transaction', async () => {
      const walletId = '1';
      const createWithdrawalDto: CreateWithdrawalDto = { amount: 50 };
      const withdrawalResponse: TransactionResponseDto = {
        ...mockTransactionResponse,
        type: TransactionType.WITHDRAWAL,
        amount: 50,
      };
      transactionsService.createWithdrawal.mockResolvedValue(
        withdrawalResponse,
      );

      const result = await controller.withdraw(walletId, createWithdrawalDto);

      expect(transactionsService.createWithdrawal).toHaveBeenCalledWith(
        walletId,
        createWithdrawalDto.amount,
      );
      expect(result).toBe(withdrawalResponse);
    });
  });
});
