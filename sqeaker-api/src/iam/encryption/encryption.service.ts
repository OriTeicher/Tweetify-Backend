import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EncryptionService {
  private readonly algo = 'aes-256-gcm';

  constructor(private readonly configService: ConfigService) {}

  encrypt(text: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      this.algo,
      this.configService.get('SECRET_KEY'),
      iv,
    );

    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    return `${authTag}|${iv.toString('hex')}|${encrypted}`;
  }

  decrypt(encrypted: string) {
    const [authTag, iv, encryptedText] = encrypted.split('|');
    const decipher = crypto.createDecipheriv(
      this.algo,
      this.configService.get('SECRET_KEY'),
      Buffer.from(iv, 'hex'),
    );
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }
}
