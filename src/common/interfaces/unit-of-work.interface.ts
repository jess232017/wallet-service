import { EntityManager } from 'typeorm';

export const UNIT_OF_WORK = 'UNIT_OF_WORK';

export interface IUnitOfWork {
  /**
   * Get the current transaction manager
   */
  getTransactionManager(): EntityManager;

  /**
   * Start a new transaction
   */
  startTransaction(): Promise<void>;

  /**
   * Commit the current transaction
   */
  commitTransaction(): Promise<void>;

  /**
   * Rollback the current transaction
   */
  rollbackTransaction(): Promise<void>;

  /**
   * Execute a function within a transaction
   * @param work Function to execute within transaction
   */
  executeInTransaction<T>(
    work: (entityManager: EntityManager) => Promise<T>,
  ): Promise<T>;
}
