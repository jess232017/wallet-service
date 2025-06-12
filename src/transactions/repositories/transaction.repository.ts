import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DeepPartial, UpdateResult } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { UNIT_OF_WORK } from '../../common/constants';
import { IUnitOfWork } from '../../common/interfaces/unit-of-work.interface';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
    @Inject(UNIT_OF_WORK)
    private readonly uow: IUnitOfWork,
  ) {}

  async create(
    data: Partial<Transaction>,
    entityManager?: EntityManager,
  ): Promise<Transaction> {
    if (entityManager) {
      return entityManager.save(Transaction, data);
    }
    return this.uow.executeInTransaction(async (em) => {
      return em.save(Transaction, data);
    });
  }

  async findOne(
    id: string,
    entityManager?: EntityManager,
  ): Promise<Transaction | null> {
    const manager = entityManager || this.uow.getEntityManager();
    return manager.findOne(Transaction, {
      where: { id },
      relations: ['wallet'],
    });
  }

  async findAll(entityManager?: EntityManager): Promise<Transaction[]> {
    const manager = entityManager || this.uow.getEntityManager();
    return manager.find(Transaction, {
      relations: ['wallet'],
    });
  }

  async findByWalletId(
    walletId: string,
    entityManager?: EntityManager,
  ): Promise<Transaction[]> {
    const manager = entityManager || this.uow.getEntityManager();
    return manager.find(Transaction, {
      where: { wallet: { id: walletId } },
      relations: ['wallet'],
    });
  }

  async findOneWithWallet(id: string): Promise<Transaction> {
    return this.repository.findOneOrFail({
      where: { id },
      relations: ['wallet'],
    });
  }

  async update(
    id: string,
    data: DeepPartial<Transaction>,
  ): Promise<UpdateResult> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
