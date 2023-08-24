import { REDIS_RETRY_ATTEMPTS, RETRY_INTERVAL } from './constants';

export const retryStrategy = (times: number) => {
  if (times > REDIS_RETRY_ATTEMPTS) return null;
  return RETRY_INTERVAL;
};
