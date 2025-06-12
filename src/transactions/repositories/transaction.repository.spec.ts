import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from '../entities/transaction.entity';
import { EntityManager, UpdateResult } from 'typeorm';
import { UNIT_OF_WORK } from '../../common/constants';
import { IUnitOfWork } from '../../common/interfaces/unit-of-work.interface';
import { TransactionType } from '../entities/transaction.entity';

const mockTransaction = {
  id: '1',
  amount: 100,
  type: TransactionType.DEPOSIT,
  walletId: '1',
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

  executeInTransaction = jest.fn().mockImplementation(
    async (cb: (em: EntityManager) => Promise<unknown>): Promise<unknown> =>
      cb({
        save: this.emSave,
        findOne: this.emFindOne,
        find: this.emFind,
      } as unknown as EntityManager),
  );
  getEntityManager = jest.fn().mockReturnValue({
    findOne: this.emFindOne,
    find: this.emFind,
  } as unknown as EntityManager);
}

describe('TransactionRepository', () => {
  let repository: TransactionRepository;
  let mockRepo: MockRepository;
  let uow: MockUnitOfWork;

  beforeEach(async () => {
    mockRepo = new MockRepository();
    uow = new MockUnitOfWork();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionRepository,
        { provide: getRepositoryToken(Transaction), useValue: mockRepo },
        { provide: UNIT_OF_WORK, useValue: uow },
      ],
    }).compile();
    repository = module.get(TransactionRepository);
  });

  it('should create a transaction with valid data', async () => {
    uow.emSave.mockResolvedValue(mockTransaction);
    const result = await repository.create(mockTransaction);
    expect(result).toEqual(mockTransaction);
  });

  it('should fail to create a transaction with incomplete data', async () => {
    uow.emSave.mockRejectedValue(new Error('Invalid data'));
    await expect(repository.create({})).rejects.toThrow('Invalid data');
  });

  it('should return null when finding a non-existent transaction', async () => {
    uow.emFindOne.mockResolvedValue(null);
    const result = await repository.findOne('999');
    expect(result).toBeNull();
  });

  it('should update a transaction', async () => {
    mockRepo.update.mockResolvedValue({ affected: 1 } as UpdateResult);
    const result = await repository.update('1', { amount: 200 });
    expect(result.affected).toBe(1);
  });

  it('should handle update for non-existent transaction', async () => {
    mockRepo.update.mockResolvedValue({ affected: 0 } as UpdateResult);
    const result = await repository.update('999', { amount: 200 });
    expect(result.affected).toBe(0);
  });

  it('should delete a transaction', async () => {
    mockRepo.delete.mockResolvedValue(undefined);
    await expect(repository.delete('1')).resolves.toBeUndefined();
  });

  it('should handle delete for non-existent transaction', async () => {
    mockRepo.delete.mockResolvedValue(undefined);
    await expect(repository.delete('999')).resolves.toBeUndefined();
  });

  it('should throw on DB error', async () => {
    uow.emSave.mockRejectedValue(new Error('DB error'));
    await expect(repository.create(mockTransaction)).rejects.toThrow(
      'DB error',
    );
  });
});
