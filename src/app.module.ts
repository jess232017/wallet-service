import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsModule } from './wallets/wallets.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UnitOfWorkModule } from './common/unit-of-work/unit-of-work.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get('DB_SYNC', 'false') === 'true', // synchronize only in development environment
        logging: config.get('DB_LOGGING', 'false') === 'true', // enable logging based on environment variable
      }),
    }),
    UnitOfWorkModule,
    WalletsModule,
    TransactionsModule,
  ],
})
export class AppModule {}
