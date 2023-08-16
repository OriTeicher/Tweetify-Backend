import { Test, TestingModule } from '@nestjs/testing';
import { EncryptService } from './encrypt.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

type configServiceMock = Partial<Record<keyof ConfigService, jest.Mock>>;

const mockConfigService: configServiceMock = {
  get: jest.fn(),
};

describe('EncryptService', () => {
  let service: EncryptService;
  let configService: typeof mockConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EncryptService>(EncryptService);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Encrypt-Decrypt', () => {
    it('Should encrypt and decrypt', () => {
      configService.get.mockReturnValue(crypto.randomBytes(32));

      const message = 'hello world ! :)';
      const encrypted = service.encrypt(message);
      const decrypted = service.decrypt(encrypted);

      expect(decrypted).toEqual(message);
    });
  });
});
