/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@/users/users.entity';
import { Role } from './rbac/role/role.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn().mockResolvedValue({}),
            signIn: jest.fn().mockResolvedValue({}),
            forgotPassword: jest.fn().mockResolvedValue({}),
            resetPassword: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    describe('Credentials are used to login ( username or email + password )', () => {
      it('should return the user object without the password on successful login', async () => {
        const signInDto: SignInDto = {
          email: 'test@example.com',
          password: 'password123',
        };

        const mockRole: Role = {
          id: 0,
          name: 'User',
          claims: [],
          users: [],
        };

        const mockUser: User = {
          id: 1,
          username: 'testuser',
          email: '',
          isActive: false,
          acceptedTerms: false,
          acceptedPrivacyPolicy: false,
          createdAt: new Date(),
          role: mockRole,
        };
        const mockToken = { accessToken: 'jwt-token', user: mockUser };
        jest.spyOn(authService, 'signIn').mockResolvedValue(mockToken);

        const result = await authController.signIn(signInDto);

        expect(result).toEqual(mockToken);
        expect(authService.signIn).toHaveBeenCalledWith(signInDto);
      });

      it('should return a 401 if the password is incorrect', async () => {
        const signInDto: SignInDto = {
          email: 'test@example.com',
          password: 'wrongpassword',
        };
        jest
          .spyOn(authService, 'signIn')
          .mockRejectedValue(new UnauthorizedException());

        await expect(authController.signIn(signInDto)).rejects.toThrow(
          UnauthorizedException,
        );
      });

      it('should return a 404 if the user does not exist', async () => {
        const signInDto: SignInDto = {
          email: 'notfound@example.com',
          password: 'password123',
        };
        jest
          .spyOn(authService, 'signIn')
          .mockRejectedValue(new NotFoundException());

        await expect(authController.signIn(signInDto)).rejects.toThrow(
          NotFoundException,
        );
      });

      it('should return a 500 if an unexpected error occurs', async () => {
        const signInDto: SignInDto = {
          email: 'test@example.com',
          password: 'password123',
        };
        jest
          .spyOn(authService, 'signIn')
          .mockRejectedValue(new InternalServerErrorException());

        await expect(authController.signIn(signInDto)).rejects.toThrow(
          InternalServerErrorException,
        );
      });
    });
  });

  describe('signUp', () => {
    it('should return the user object without the password on successful signup', async () => {
      const signUpDto: SignUpDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'StrongPassword123!',
        acceptedTerms: true,
        acceptedPrivacyPolicy: true,
      };

      const mockToken = { accessToken: 'jwt-token' };
      jest.spyOn(authService, 'signUp').mockResolvedValue(mockToken);

      const result = await authController.signUp(signUpDto);

      expect(result).toEqual(mockToken);
      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
    });

    it('should return a 400 if the username is missing', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        password: 'StrongPassword123!',
        acceptedTerms: true,
        acceptedPrivacyPolicy: true,
      };

      jest
        .spyOn(authService, 'signUp')
        .mockRejectedValue(new BadRequestException());

      await expect(authController.signUp(signUpDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return a 400 if the password is missing', async () => {
      const signUpDto: SignUpDto = {
        username: 'testuser',
        email: 'test@example.com',
        acceptedTerms: true,
        acceptedPrivacyPolicy: true,
        password: '',
      };
      jest
        .spyOn(authService, 'signUp')
        .mockRejectedValue(new BadRequestException());
      await expect(authController.signUp(signUpDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return a 400 if the email is invalid', async () => {
      const signUpDto: SignUpDto = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'StrongPassword123!',
        acceptedTerms: true,
        acceptedPrivacyPolicy: true,
      };

      jest
        .spyOn(authService, 'signUp')
        .mockRejectedValue(new BadRequestException());

      await expect(authController.signUp(signUpDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return a 400 if the email is missing', async () => {
      const signUpDto: SignUpDto = {
        username: 'testuser',
        password: 'StrongPassword123!',
        acceptedTerms: true,
        acceptedPrivacyPolicy: true,
        email: '',
      };

      jest
        .spyOn(authService, 'signUp')
        .mockRejectedValue(new BadRequestException());

      await expect(authController.signUp(signUpDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return a 400 if the email is already taken', async () => {
      const signUpDto: SignUpDto = {
        username: 'testuser',
        email: 'taken@example.com',
        password: 'StrongPassword123!',
        acceptedTerms: true,
        acceptedPrivacyPolicy: true,
      };

      jest
        .spyOn(authService, 'signUp')
        .mockRejectedValue(new ConflictException());
      await expect(authController.signUp(signUpDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should return a 500 if an unexpected error occurs', async () => {
      const signUpDto: SignUpDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'StrongPassword123!',
        acceptedTerms: true,
        acceptedPrivacyPolicy: true,
      };

      jest
        .spyOn(authService, 'signUp')
        .mockRejectedValue(new InternalServerErrorException());

      await expect(authController.signUp(signUpDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('forgotPassword', () => {
    it('should return a 200 if the email exists', async () => {
      jest.spyOn(authService, 'forgotPassword').mockResolvedValue(undefined);

      const result = await authController.forgotPassword('test@example.com');

      expect(result).toEqual({
        message:
          'If an account with this email exists, a password reset link will be sent.',
      });
      expect(authService.forgotPassword).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('should return a 404 if the email does not exist', async () => {
      jest
        .spyOn(authService, 'forgotPassword')
        .mockRejectedValue(new NotFoundException());

      await expect(
        authController.forgotPassword('notfound@example.com'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return a 500 if an unexpected error occurs', async () => {
      jest
        .spyOn(authService, 'forgotPassword')
        .mockRejectedValue(new InternalServerErrorException());

      await expect(
        authController.forgotPassword('test@example.com'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
