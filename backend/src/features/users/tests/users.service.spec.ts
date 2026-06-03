import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UserRoles } from 'src/generated/prisma/enums';
import { UpdateUserDTO } from '../dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;

  const mockPrisma = {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
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
      userId: 'abc123',
      email: 'john@test.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRoles.CREATOR,
    };

    mockPrisma.user.create.mockResolvedValue(mockUser);

    const res = await service.createUser(dto);
    expect(res).toEqual(mockUser);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        user_id: dto.userId,
        email: dto.email,
        first_name: dto.firstName,
        last_name: dto.lastName,
        role: dto.role,
      },
    });
  });

  it('should throw if required fields are missing', async () => {
    const dto = {
      userId: '',
      email: '',
      firstName: '',
      lastName: '',
      role: '' as unknown,
    } as CreateUserDTO;

    mockPrisma.user.create.mockRejectedValue(new Error('Invalid data'));

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
      userId: '123abc',
      email: 'john@test.com',
      firstName: 'John',
      lastName: 'Eod',
      role: UserRoles.CREATOR,
    } as CreateUserDTO;

    await expect(service.createUser(dto)).rejects.toThrow(ConflictException);
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

    await expect(service.getActiveUserById('999')).rejects.toThrow(NotFoundException);
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
