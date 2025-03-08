import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DeleteResult, Repository } from 'typeorm';
import { isValidEmail } from '../../utils/mails/mails.helper';
import { Claim } from '../auth/rbac/claims.enum';
import { Role } from '../auth/rbac/role/role.entity';
import { User } from './users.entity';
import { UsersService } from './users.service';

jest.mock('../../utils/mails/mails.helper', () => ({
  isValidEmail: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;
  let rolesRepository: Repository<Role>;

  const mockRole: Role = {
    id: 1,
    name: 'User',
    claims: [Claim.READ_OWN_USER, Claim.WRITE_OWN_USER, Claim.DELETE_OWN_USER],
    users: [],
  };

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword' as string,
    isActive: true,
    acceptedTerms: false,
    acceptedPrivacyPolicy: false,
    createdAt: new Date(),
    role: mockRole,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn((user: User): User => user),
            delete: jest
              .fn()
              .mockResolvedValue({ affected: 1 } as DeleteResult),
          },
        },
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    rolesRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  describe('createUser', () => {
    it('should create a new user with a hashed password and default role', async () => {
      const user: User = {
        id: 0,
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        isActive: true,
        acceptedTerms: false,
        acceptedPrivacyPolicy: false,
        createdAt: new Date(),
        role: mockRole,
      };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(rolesRepository, 'findOne').mockResolvedValue(mockRole);
      (
        jest.spyOn(bcrypt, 'hash') as jest.MockInstance<any, any>
      ).mockResolvedValue('hashedPassword');
      jest
        .spyOn(usersRepository, 'save')
        .mockResolvedValue({ ...user, password: 'hashedPassword' });

      jest.spyOn(usersRepository, 'save').mockResolvedValue({
        ...user,
        password: 'hashedPassword',
      });

      (isValidEmail as jest.Mock).mockReturnValue(true);

      const createdUser = await service.createUser(user);
      expect(createdUser.password).toBe('hashedPassword');
      expect(createdUser.role).toEqual(mockRole);
    });

    it('should throw an error if the username is already taken', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);
      await expect(service.createUser(mockUser)).rejects.toThrow(
        'Username is already taken',
      );
    });
  });

  describe('getUser', () => {
    it('should throw BadRequestException if username is empty', async () => {
      await expect(service.getUser('')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if username is null', async () => {
      await expect(service.getUser(null as unknown as string)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return a user when username is provided', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(mockUser);

      const user = await service.getUser('testuser');

      expect(user).toBeDefined();
      expect(user.username).toBe('testuser');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.getUser('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update user password securely', async () => {
      const updatedUser = { ...mockUser, password: 'newHashedPassword' };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);
      (
        jest.spyOn(bcrypt, 'hash') as jest.MockInstance<any, any>
      ).mockResolvedValue('hashedPassword');
      jest
        .spyOn(usersRepository, 'save')
        .mockResolvedValue({ ...updatedUser, password: 'hashedPassword' });

      jest.spyOn(usersRepository, 'save').mockResolvedValue(updatedUser);
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(updatedUser);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(updatedUser);

      const result = await service.updateUser('testuser', {
        password: 'newPassword',
      });
      expect(result.password).toBe('newHashedPassword');
    });
  });

  describe('deleteUser', () => {
    it('should delete an existing user', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(usersRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as DeleteResult);

      await expect(service.deleteUser('testuser')).resolves.toBeUndefined();
    });
  });
});
