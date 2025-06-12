import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitOfWork } from './unit-of-work';
import { UNIT_OF_WORK } from '../constants';

@Module({
  imports: [TypeOrmModule],
  providers: [
    {
      provide: UNIT_OF_WORK,
      useClass: UnitOfWork,
    },
  ],
  exports: [UNIT_OF_WORK],
})
export class UnitOfWorkModule {}
