import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WalletRepository } from './wallet.repository';
import { Wallet } from '../entities/wallet.entity';
import { EntityManager, UpdateResult } from 'typeorm';
import { UNIT_OF_WORK } from '../../common/constants';
import { IUnitOfWork } from '../../common/interfaces/unit-of-work.interface';

const mockWallet = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  balance: 1000,
  name: 'Test Wallet',
  transactions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

class MockRepository {
  save = jest.fn();
  findOne = jest.fn();
  find = jest.fn();
  findOneOrFail = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

class MockUnitOfWork implements IUnitOfWork {
  public emSave = jest.fn();
  public emFindOne = jest.fn();
  public emFind = jest.fn();
  public emCreate = jest.fn();
  public emDelete = jest.fn();

  executeInTransaction = jest.fn().mockImplementation(
    async (cb: (em: EntityManager) => Promise<unknown>): Promise<unknown> =>
      cb({
        save: this.emSave,
        findOne: this.emFindOne,
        find: this.emFind,
        create: this.emCreate,
        delete: this.emDelete,
      } as unknown as EntityManager),
  );
  getEntityManager = jest.fn().mockReturnValue({
    findOne: this.emFindOne,
    find: this.emFind,
    create: this.emCreate,
    delete: this.emDelete,
  } as unknown as EntityManager);
}

describe('WalletRepository', () => {
  let repository: WalletRepository;
  let mockRepo: MockRepository;
  let uow: MockUnitOfWork;

  beforeEach(async () => {
    mockRepo = new MockRepository();
    uow = new MockUnitOfWork();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletRepository,
        { provide: getRepositoryToken(Wallet), useValue: mockRepo },
        { provide: UNIT_OF_WORK, useValue: uow },
      ],
    }).compile();
    repository = module.get(WalletRepository);
  });

  describe('create', () => {
    it('should create a wallet with valid data', async () => {
      const createdWallet = { ...mockWallet };
      uow.emCreate.mockReturnValue(createdWallet);
      uow.emSave.mockResolvedValue(createdWallet);
      const result = await repository.create(mockWallet);
      expect(result).toEqual(createdWallet);
    });

    it('should fail to create a wallet with incomplete data', async () => {
      uow.emCreate.mockImplementation(() => {
        throw new Error('Invalid data');
      });
      await expect(repository.create({})).rejects.toThrow('Invalid data');
    });
  });

  describe('findAll', () => {
    it('should return all wallets', async () => {
      const wallets = [mockWallet];
      uow.emFind.mockResolvedValue(wallets);
      const result = await repository.findAll();
      expect(result).toEqual(wallets);
    });

    it('should return empty array when no wallets exist', async () => {
      uow.emFind.mockResolvedValue([]);
      const result = await repository.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a wallet when it exists', async () => {
      uow.emFindOne.mockResolvedValue(mockWallet);
      const result = await repository.findOne(mockWallet.id);
      expect(result).toEqual(mockWallet);
    });

    it('should return null when wallet is not found', async () => {
      uow.emFindOne.mockResolvedValue(null);
      const result = await repository.findOne('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a wallet successfully', async () => {
      const updatedWallet = { ...mockWallet, balance: 2000 };
      uow.emSave.mockResolvedValue(updatedWallet);
      const result = await repository.update(updatedWallet);
      expect(result).toEqual(updatedWallet);
    });

    it('should handle update for non-existent wallet', async () => {
      uow.emSave.mockRejectedValue(new Error('Wallet not found'));
      await expect(
        repository.update({ id: 'non-existent' } as Wallet),
      ).rejects.toThrow('Wallet not found');
    });
  });

  describe('delete', () => {
    it('should delete a wallet successfully', async () => {
      uow.emDelete.mockResolvedValue({ affected: 1 } as UpdateResult);
      await expect(repository.delete(mockWallet.id)).resolves.toBeUndefined();
    });

    it('should handle delete for non-existent wallet', async () => {
      uow.emDelete.mockResolvedValue({ affected: 0 } as UpdateResult);
      await expect(
        repository.delete('non-existent-id'),
      ).resolves.toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should throw on DB error during create', async () => {
      uow.emCreate.mockImplementation(() => {
        throw new Error('DB error');
      });
      await expect(repository.create(mockWallet)).rejects.toThrow('DB error');
    });

    it('should throw on DB error during find', async () => {
      uow.emFind.mockRejectedValue(new Error('DB error'));
      await expect(repository.findAll()).rejects.toThrow('DB error');
    });

    it('should throw on DB error during findOne', async () => {
      uow.emFindOne.mockRejectedValue(new Error('DB error'));
      await expect(repository.findOne(mockWallet.id)).rejects.toThrow(
        'DB error',
      );
    });
  });
});
