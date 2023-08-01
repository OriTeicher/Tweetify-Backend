import { Test, TestingModule } from '@nestjs/testing';
import { UserRepositry } from './user.repository';
import { BaseRepository } from './base-repsoitory.repository';
import { Firestore } from '@firebase/firestore';
import { UserEntity } from 'src/users/entities/user.entity';

class EntityBase {
  id: string;
}

type MockRepository<T extends EntityBase> = Partial<
  Record<keyof BaseRepository<T>, jest.Mock>
>;

const createMockRepository = <T extends EntityBase>(): MockRepository<T> => ({
  create: jest.fn(),
  fineOne: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('UsersRepository', () => {
  let repo: UserRepositry;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Firestore,
          useValue: createMockRepository(),
        },
        UserRepositry,
      ],
    }).compile();

    repo = module.get<UserRepositry>(UserRepositry);
  });

  describe('Should be defined', () => {
    it('Should be defined', () => {
      expect(repo).toBeDefined();
    });
  });

  describe('create', () => {
    describe('When unique', () => {
      it('Should pass', async () => {
        const user1: UserEntity = {
          id: '123',
          email: 'test1@gmail.com',
          username: 'test1',
          displayName: 'test',
          postsId: [],
          createdAt: 123,
          password: '123',
        };

        const user2: UserEntity = {
          id: '1234',
          email: 'test2@gmail.com',
          username: 'test2',
          displayName: 'test',
          postsId: [],
          createdAt: 123,
          password: '123',
        };

        const createdUser1 = await repo.create(user1);
        const createdUser2 = await repo.create(user2);

        //console.log(createdUser1);
      });
    });

    describe('When not unique', () => {
      it('Should throw', () => {});
    });
  });
});
