import { Injectable, Inject } from '@nestjs/common';
import { Wallet } from '../entities/wallet.entity';
import { EntityManager } from 'typeorm';
import { UNIT_OF_WORK } from '../../common/constants';
import { IUnitOfWork } from '../../common/interfaces/unit-of-work.interface';

@Injectable()
export class WalletRepository {
  constructor(
    @Inject(UNIT_OF_WORK)
    private readonly uow: IUnitOfWork,
  ) {}

  async create(
    data: Partial<Wallet>,
    entityManager?: EntityManager,
  ): Promise<Wallet> {
    if (entityManager) {
      const wallet = entityManager.create(Wallet, data);
      return entityManager.save(wallet);
    }
    return this.uow.executeInTransaction(async (em) => {
      const wallet = em.create(Wallet, data);
      return em.save(wallet);
    });
  }

  async findAll(entityManager?: EntityManager): Promise<Wallet[]> {
    if (entityManager) {
      return entityManager.find(Wallet);
    }
    return this.uow.executeInTransaction(async (em) => {
      return em.find(Wallet);
    });
  }

  async findOne(
    id: string,
    entityManager?: EntityManager,
  ): Promise<Wallet | null> {
    if (entityManager) {
      return entityManager.findOne(Wallet, { where: { id } });
    }
    return this.uow.executeInTransaction(async (em) => {
      return em.findOne(Wallet, { where: { id } });
    });
  }

  async update(wallet: Wallet, entityManager?: EntityManager): Promise<Wallet> {
    if (entityManager) {
      return entityManager.save(wallet);
    }
    return this.uow.executeInTransaction(async (em) => {
      return em.save(wallet);
    });
  }

  async delete(id: string, entityManager?: EntityManager): Promise<void> {
    if (entityManager) {
      await entityManager.delete(Wallet, id);
      return;
    }
    await this.uow.executeInTransaction(async (em) => {
      await em.delete(Wallet, id);
    });
  }
}
