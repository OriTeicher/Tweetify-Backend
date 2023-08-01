export type MockRepository<T = any> = Partial<
  Record<'create' | 'findOne' | 'findAll' | 'update' | 'remove', jest.Mock<T>>
>;

export const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});
