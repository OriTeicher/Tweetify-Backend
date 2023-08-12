import { Module } from '@nestjs/common';
import { EncryptionService } from './encryption/encryption.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [EncryptionService],
  imports: [ConfigModule],
})
export class IamModule {}
