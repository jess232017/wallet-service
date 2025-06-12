import { EntityManager } from 'typeorm';

/**
 * Interface defining the contract for Unit of Work pattern implementation
 */
export interface IUnitOfWork {
  /**
   * Executes a function within a transaction
   * @param work Function to execute within transaction
   */
  executeInTransaction<T>(
    work: (entityManager: EntityManager) => Promise<T>,
  ): Promise<T>;

  /**
   * Gets the current EntityManager instance
   */
  getEntityManager(): EntityManager;
}
