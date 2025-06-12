import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './app.controller';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  HealthCheckStatus,
  HealthIndicatorStatus,
} from '@nestjs/terminus';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: jest.Mocked<HealthCheckService>;
  let checkSpy: jest.SpyInstance;

  beforeEach(async () => {
    const mockHealthCheckService = {
      check: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: { pingCheck: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get(HealthCheckService);
    checkSpy = jest.spyOn(healthCheckService, 'check');
  });

  describe('check', () => {
    it('should perform health check', async () => {
      const mockHealthResult = {
        status: 'ok' as HealthCheckStatus,
        info: {
          database: {
            status: 'up' as HealthIndicatorStatus,
          },
        },
        details: {
          database: {
            status: 'up' as HealthIndicatorStatus,
          },
        },
      };

      healthCheckService.check.mockResolvedValue(mockHealthResult);

      const result = await controller.check();

      expect(checkSpy).toHaveBeenCalled();
      expect(result).toEqual(mockHealthResult);
    });

    it('should handle database health check failure', async () => {
      const error = new Error('Database connection failed');
      healthCheckService.check.mockRejectedValue(error);

      await expect(controller.check()).rejects.toThrow(
        'Database connection failed',
      );
      expect(checkSpy).toHaveBeenCalled();
    });
  });
});
