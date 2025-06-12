import { EntityTarget, ObjectLiteral } from 'typeorm';
import { IUnitOfWork } from '../interfaces/unit-of-work.interface';
import { TypeOrmRepository } from './typeorm.repository';

export class RepositoryFactory {
  constructor(private readonly unitOfWork: IUnitOfWork) {}

  createRepository<T extends ObjectLiteral>(
    entity: EntityTarget<T>,
  ): TypeOrmRepository<T> {
    return new TypeOrmRepository<T>(this.unitOfWork.getEntityManager(), entity);
  }
}
