import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UserRoles } from '@prisma/client';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { LoginUserDTO } from '../dto/login-user.dto';

describe('UserService', () => {
  let service: UserService;

  const mockPrisma = {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockSupabase = {
    client: {
      auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: SupabaseService,
          useValue: mockSupabase,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should create a user', async () => {
    const mockUser = {
      user_id: 'abc123',
      email: 'john@test.com',
      createdAt: new Date(),
      first_name: 'John',
      last_name: 'Doe',
      role: UserRoles.CREATOR,
      is_active: true,
    };

    const dto: CreateUserDTO = {
      email: 'john@test.com',
      password: 'Password1!',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRoles.CREATOR,
    };

    mockPrisma.user.findFirst.mockResolvedValue(null);
    mockSupabase.client.auth.signUp.mockResolvedValue({
      data: {
        user: {
          id: 'abc123',
        },
      },
      error: null,
    });
    mockPrisma.user.create.mockResolvedValue(mockUser);

    const res = await service.createUser(dto);
    expect(res).toEqual(mockUser);
    expect(mockSupabase.client.auth.signUp).toHaveBeenCalledWith({
      email: dto.email,
      password: dto.password,
      options: {
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          role: dto.role,
        },
      },
    });
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        user_id: 'abc123',
        email: dto.email,
        first_name: dto.firstName,
        last_name: dto.lastName,
        role: dto.role,
      },
    });
  });

  it('should throw if required fields are missing', async () => {
    const dto = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: '' as unknown,
    } as CreateUserDTO;

    mockPrisma.user.findFirst.mockResolvedValue(null);
    mockSupabase.client.auth.signUp.mockResolvedValue({
      data: {
        user: null,
      },
      error: {
        message: 'Invalid data',
      },
    });

    await expect(service.createUser(dto)).rejects.toThrow('Invalid data');
  });

  it('should throw if there is an existing email', async () => {
    const mockUser1 = {
      user_id: 'abc123',
      email: 'john@test.com',
      createdAt: new Date(),
      first_name: 'John',
      last_name: 'Doe',
      role: UserRoles.CREATOR,
      is_active: true,
    };

    mockPrisma.user.findFirst.mockResolvedValue(mockUser1);

    const dto = {
      email: 'john@test.com',
      password: 'Password1!',
      firstName: 'John',
      lastName: 'Eod',
      role: UserRoles.CREATOR,
    } as CreateUserDTO;

    await expect(service.createUser(dto)).rejects.toThrow(ConflictException);
    expect(mockSupabase.client.auth.signUp).not.toHaveBeenCalled();
  });

  it('should login a user', async () => {
    const mockUser = {
      user_id: 'abc123',
      email: 'john@test.com',
      createdAt: new Date(),
      first_name: 'John',
      last_name: 'Doe',
      role: 'CREATOR',
      is_active: true,
    };

    const dto: LoginUserDTO = {
      email: 'john@test.com',
      password: 'Password1!',
    };

    const session = {
      access_token: 'access-token',
      refresh_token: 'refresh-token',
    };

    mockSupabase.client.auth.signInWithPassword.mockResolvedValue({
      data: {
        user: {
          id: 'abc123',
        },
        session,
      },
      error: null,
    });
    mockPrisma.user.findFirst.mockResolvedValue(mockUser);

    const res = await service.login(dto);

    expect(res).toEqual({
      user: mockUser,
      session,
    });
    expect(mockSupabase.client.auth.signInWithPassword).toHaveBeenCalledWith({
      email: dto.email,
      password: dto.password,
    });
    expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        user_id: 'abc123',
        is_active: true,
      },
    });
  });

  it('should find a user', async () => {
    const mockUser = {
      user_id: '1',
      email: 'testemail@test.com',
      createdAt: new Date(),
      first_name: 'John',
      last_name: 'Doe',
      role: 'CREATOR',
      is_active: true,
    };

    mockPrisma.user.findFirst.mockResolvedValue(mockUser);

    const res = await service.getActiveUserById('1');

    expect(res).toEqual(mockUser);
    expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        user_id: '1',
        is_active: true,
      },
    });
  });

  it('should throw NotFoundException if user not found', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null);

    await expect(service.getActiveUserById('999')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a user', async () => {
    const mockUser = {
      user_id: 'abc123',
      email: 'john@test.com',
      createdAt: new Date(),
      first_name: 'John',
      last_name: 'Doe',
      role: 'CREATOR',
      is_active: true,
    };

    const dto: UpdateUserDTO = {
      email: 'newemail@test.com',
      firstName: 'Jane',
      lastName: 'Smith',
    };

    const updatedUser = {
      ...mockUser,
      email: dto.email,
      first_name: dto.firstName,
      last_name: dto.lastName,
    };

    mockPrisma.user.findFirst.mockResolvedValue(mockUser);
    mockPrisma.user.update.mockResolvedValue(updatedUser);

    const res = await service.updateById('abc123', dto);

    expect(res).toEqual(updatedUser);
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { user_id: 'abc123' },
      data: {
        email: dto.email,
        first_name: dto.firstName,
        last_name: dto.lastName,
      },
    });
  });

  it('should deactivate a user', async () => {
    const mockUser = {
      user_id: 'abc123',
      email: 'john@test.com',
      createdAt: new Date(),
      first_name: 'John',
      last_name: 'Doe',
      role: 'CREATOR',
      is_active: false,
    };

    mockPrisma.user.findFirst.mockResolvedValue(mockUser);
    mockPrisma.user.update.mockResolvedValue(mockUser);

    const res = await service.deactivateById('abc123');

    expect(res).toEqual(mockUser);
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { user_id: 'abc123' },
      data: { is_active: false },
    });
  });
});
