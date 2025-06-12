import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUnitOfWork } from './typeorm-unit-of-work';
import { UNIT_OF_WORK } from '../interfaces/unit-of-work.interface';

@Module({
  imports: [TypeOrmModule],
  providers: [
    {
      provide: UNIT_OF_WORK,
      useClass: TypeOrmUnitOfWork,
    },
  ],
  exports: [UNIT_OF_WORK],
})
export class UnitOfWorkModule {}
