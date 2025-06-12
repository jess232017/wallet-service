import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';
import { UNIT_OF_WORK } from '../../common/constants';
import { IUnitOfWork } from '../../common/interfaces/unit-of-work.interface';

@Injectable()
export class WalletRepository {
  constructor(
    @InjectRepository(Wallet)
    private readonly repository: Repository<Wallet>,
    @Inject(UNIT_OF_WORK)
    private readonly uow: IUnitOfWork,
  ) {}

  async create(
    data: Partial<Wallet>,
    entityManager?: EntityManager,
  ): Promise<Wallet> {
    if (entityManager) {
      return entityManager.save(Wallet, data);
    }
    return this.uow.executeInTransaction(async (em) => {
      return em.save(Wallet, data);
    });
  }

  async findOne(id: string, entityManager?: EntityManager): Promise<Wallet> {
    const manager = entityManager || this.uow.getEntityManager();
    const wallet = await manager.findOne(Wallet, {
      where: { id },
    });
    if (!wallet) {
      throw new NotFoundException(`Wallet ${id} not found`);
    }
    return wallet;
  }

  async findAll(entityManager?: EntityManager): Promise<Wallet[]> {
    const manager = entityManager || this.uow.getEntityManager();
    return manager.find(Wallet);
  }

  async update(
    id: string,
    data: Partial<Wallet>,
    entityManager?: EntityManager,
  ): Promise<void> {
    const manager = entityManager || this.uow.getEntityManager();
    await manager.update(Wallet, id, data);
  }

  async delete(id: string, entityManager?: EntityManager): Promise<void> {
    const manager = entityManager || this.uow.getEntityManager();
    await manager.delete(Wallet, id);
  }

  async updateBalance(
    id: string,
    amount: number,
    entityManager?: EntityManager,
  ): Promise<void> {
    const manager = entityManager || this.uow.getEntityManager();
    await manager
      .createQueryBuilder()
      .update(Wallet)
      .set({ balance: () => `balance + ${amount}` })
      .where('id = :id', { id })
      .execute();
  }
}
