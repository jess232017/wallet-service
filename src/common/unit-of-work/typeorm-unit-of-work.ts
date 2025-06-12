import { Injectable } from '@nestjs/common';
import { EntityManager, DataSource } from 'typeorm';
import { IUnitOfWork } from '../interfaces/unit-of-work.interface';

@Injectable()
export class TypeOrmUnitOfWork implements IUnitOfWork {
  private transactionManager: EntityManager | null = null;

  constructor(private readonly dataSource: DataSource) {}

  getTransactionManager(): EntityManager {
    if (!this.transactionManager) {
      throw new Error('No active transaction');
    }
    return this.transactionManager;
  }

  getEntityManager(): EntityManager {
    return this.getTransactionManager();
  }

  async startTransaction(): Promise<void> {
    if (this.transactionManager) {
      throw new Error('Transaction already started');
    }
    this.transactionManager = this.dataSource.createEntityManager();
    await this.transactionManager.query('START TRANSACTION');
  }

  async commitTransaction(): Promise<void> {
    if (!this.transactionManager) {
      throw new Error('No active transaction');
    }
    await this.transactionManager.query('COMMIT');
    this.transactionManager = null;
  }

  async rollbackTransaction(): Promise<void> {
    if (!this.transactionManager) {
      throw new Error('No active transaction');
    }
    await this.transactionManager.query('ROLLBACK');
    this.transactionManager = null;
  }

  async executeInTransaction<T>(
    work: (entityManager: EntityManager) => Promise<T>,
  ): Promise<T> {
    try {
      await this.startTransaction();
      const result = await work(this.getTransactionManager());
      await this.commitTransaction();
      return result;
    } catch (error) {
      await this.rollbackTransaction();
      throw error;
    }
  }
}
