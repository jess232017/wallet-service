import { DeepPartial } from 'typeorm';

export interface IRepository<T> {
  findOne(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: DeepPartial<T>): Promise<T>;
  update(id: string, data: DeepPartial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
