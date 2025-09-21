import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsPublic } from './auth/decorators/is-public.decorator';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getStatus(): string {
    const version = this.configService.get<string>('version');
    return `Pointregisters - API! - Running successfully v.${version}`;
  }
}