import { SetMetadata } from '@nestjs/common';
import { CacheType } from './cache.enum';

export const CACHE_TYPE_KEY = 'cacheType';

export const Cache = (...cacheTypes: CacheType[]) => {
  return SetMetadata(CACHE_TYPE_KEY, cacheTypes);
};
