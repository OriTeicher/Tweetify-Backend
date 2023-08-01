import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Firestore } from '@firebase/firestore';
import { UserRepositry } from 'src/database/repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { PostRepsitory } from 'src/database/repositories/posts.repository';
import { PostEntity } from 'src/posts/entities/post.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

type MockRepository<T = any> = Partial<
  Record<'create' | 'findOne' | 'findAll' | 'update' | 'remove', jest.Mock<T>>
>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

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

  describe('create', () => {
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

    describe('When unique', () => {
      it('Should pass', async () => {
        repo.create.mockReturnValue(expectedUser);
        const user = await service.create(userDto);

        expect(user).toEqual(expectedUser);
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
  });
});
