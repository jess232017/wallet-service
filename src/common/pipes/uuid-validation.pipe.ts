import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class UUIDValidationPipe implements PipeTransform {
  transform(value: unknown): string {
    if (!isUUID(value, 4)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return value as string;
  }
}
