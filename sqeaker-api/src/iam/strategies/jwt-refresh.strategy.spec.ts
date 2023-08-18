import { JwtRefreshStrategy } from './jwt-refresh.strategy';

describe('JwtRefreshStrategy', () => {
  it('should be defined', () => {
    expect(new JwtRefreshStrategy()).toBeDefined();
  });
});
