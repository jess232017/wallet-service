import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { IUnitOfWork } from '../interfaces/unit-of-work.interface';

/**
 * Implementation of the Unit of Work pattern
 */
@Injectable()
export class UnitOfWork implements IUnitOfWork {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Executes a function within a transaction
   * @param work Function to execute within transaction
   */
  async executeInTransaction<T>(
    work: (entityManager: EntityManager) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await work(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Gets the current EntityManager instance
   */
  getEntityManager(): EntityManager {
    return this.dataSource.createEntityManager();
  }
}
