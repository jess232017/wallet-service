import {
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  DeepPartial,
  FindOptionsWhere,
} from 'typeorm';
import { IRepository } from '../interfaces/repository.interface';

export class TypeOrmRepository<T extends ObjectLiteral>
  implements IRepository<T>
{
  constructor(
    private readonly entityManager: EntityManager,
    private readonly entity: EntityTarget<T>,
  ) {}

  async findOne(id: string): Promise<T | null> {
    return this.entityManager.findOne(this.entity, {
      where: { id } as unknown as FindOptionsWhere<T>,
    });
  }

  async findAll(): Promise<T[]> {
    return this.entityManager.find(this.entity);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.entityManager.create(this.entity, data);
    return this.entityManager.save(this.entity, entity);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`Entity with id ${id} not found`);
    }
    Object.assign(entity, data);
    return this.entityManager.save(this.entity, entity);
  }

  async delete(id: string): Promise<void> {
    await this.entityManager.delete(this.entity, id);
  }
}
