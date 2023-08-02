import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Firestore } from '@firebase/firestore';
import { UserRepositry } from 'src/database/repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { PostRepsitory } from 'src/database/repositories/posts.repository';
import { PostEntity } from 'src/posts/entities/post.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  MockRepository,
  createMockRepository,
} from 'src/common/__mocks__/repositry.mock';

describe('UsersService', () => {
  let service: UsersService;
  let repo: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: Firestore,
          useValue: createMockRepository(),
        },
        {
          provide: UserRepositry,
          useValue: createMockRepository<UserEntity>(),
        },
        {
          provide: PostRepsitory,
          useValue: createMockRepository<PostEntity>(),
        },
      ],
    }).compile();

    repo = module.get<MockRepository>(UserRepositry);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const userDto: CreateUserDto = {
    email: 'test@gmail.com',
    username: 'test',
    displayName: 'test',
    password: '123',
  };

  const expectedUser: UserEntity = {
    id: '123',
    email: 'test@gmail.com',
    username: 'test',
    displayName: 'test',
    postsId: [],
    createdAt: 123,
    password: '123',
  };

  describe('create', () => {
    describe('When unique', () => {
      it('Should pass', async () => {
        repo.create.mockReturnValue(expectedUser);
        const user = await service.create(userDto);

        expect(user).toEqual(expectedUser);
      });
    });

    describe('When not unique', () => {
      it('Should fail with ConflictErrorException', async () => {
        const arr: UserEntity[] = [];

        repo.create.mockImplementation(async (newUser) => {
          newUser = {
            ...newUser,
            id: '123',
            createdAt: 123,
          };

          if (arr.find((entity) => entity.id === newUser.id))
            throw new ConflictException(
              `User with email: '${newUser.email}' already exists`,
            );

          arr.push(newUser);
        });

        try {
          await service.create(userDto);
          await service.create(userDto);

          expect(false).toBeTruthy();
        } catch (error) {
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.message).toEqual(
            `User with email: '${userDto.email}' already exists`,
          );
        }
      });
    });
  });

  describe('fineOne', () => {
    describe('When exists', () => {
      it('should return the correct object', async () => {
        const user: UserEntity = Object.create(UserEntity);
        const userId = '1';

        repo.findOne.mockReturnValue(user);
        const foundUser = await service.findOne(userId);
        expect(foundUser).toEqual(user);
      });
    });

    describe('When does not exist', () => {
      it('Should throw a NotFoundError', async () => {
        const userId = '1';

        repo.findOne.mockImplementation((id: string) => {
          throw new NotFoundException(
            `UserEntity with id: ${id} does not exist`,
          );
        });

        try {
          await service.findOne(userId);
          expect(false).toBeTruthy();
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toEqual(
            `UserEntity with id: ${userId} does not exist`,
          );
        }
      });
    });
  });

  describe('findAll', () => {
    describe('The db contain users', () => {
      it('should return an array of users', async () => {
        const expectedArray = [expectedUser, expectedUser, expectedUser];
        let users;

        repo.findAll.mockReturnValue(expectedArray);
        users = await service.findAll(null);

        expect(users).toEqual(expectedArray);
      });
    });

    describe('The db has no users', () => {
      it('Should return an empty array', async () => {
        const expectedArray = [];
        let users;

        repo.findAll.mockResolvedValue(expectedArray);
        users = await service.findAll(null);

        expect(users).toEqual([]);
      });
    });
  });

  describe('update', () => {
    describe('When the user exists', () => {
      it('Should return updated user', async () => {
        const updateDto: UpdateUserDto = {
          displayName: 'updated',
          username: 'updated',
        };

        const expected = {
          ...expectedUser,
          ...updateDto,
        };

        repo.update.mockImplementation((id: string, updated: UserEntity) =>
          Object.assign<UserEntity, UserEntity>(expectedUser, updated),
        );
        const result = await service.update('1', updateDto);

        expect(result).toEqual(expected);
      });
    });

    describe('When the user does not exist', () => {
      it('Should throw a NotFoundException', async () => {
        repo.update.mockImplementation((id: string, updated: UpdateUserDto) => {
          throw new NotFoundException(
            `${UserEntity.name} with id: ${id} does not exist`,
          );
        });

        try {
          await service.update('1', { username: 'updated' });
          expect(false).toBeTruthy();
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toEqual('UserEntity with id: 1 does not exist');
        }
      });
    });
  });

  describe('remove', () => {
    describe('When the user exists', () => {
      it('Should remove the user', async () => {
        repo.findOne.mockReturnValue({ postsId: [] });
        repo.remove.mockImplementation((id: string) => {});
        await service.remove('1');
      });
    });

    describe('When the user does not exist', () => {
      it('Should throw NotFoundException', async () => {
        repo.findOne.mockReturnValue({ postsId: [] });
        repo.remove.mockImplementation((id: string) => {
          throw new NotFoundException(
            `${UserEntity.name} with id: ${id} does not exist`,
          );
        });

        try {
          await service.remove('1');
          expect(false).toBeTruthy();
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toEqual('UserEntity with id: 1 does not exist');
        }
      });
    });
  });
});
