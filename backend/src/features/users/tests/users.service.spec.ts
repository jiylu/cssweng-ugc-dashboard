import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../users.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserTransactionDTO } from '../dto/create-user-transaction.dto';
import { UserRoles } from '@prisma/client';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { SupabaseService } from 'src/shared/supabase/supabase.service';
import { LoginUserDTO } from '../dto/login-user.dto';
import { OtpService } from '../../otp/otp.service';

describe('UserService', () => {
  let service: UserService;

  const mockPrisma = {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    clients: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockSupabase = {
    client: {
      auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
      },
    },
    adminClient: {
      auth: {
        admin: {
          updateUserById: jest.fn(),
        },
      },
    },
  };

  const mockOtp = {
    consumeVerification: jest.fn(),
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
        {
          provide: OtpService,
          useValue: mockOtp,
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

    const dto: CreateUserTransactionDTO = {
      userDTO: {
        email: 'john@test.com',
        password: 'Password1!',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRoles.CREATOR,
        verificationToken: 'token',
      },
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
      email: dto.userDTO.email,
      password: dto.userDTO.password,
      options: {
        data: {
          firstName: dto.userDTO.firstName,
          lastName: dto.userDTO.lastName,
          role: dto.userDTO.role,
        },
      },
    });
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        user_id: 'abc123',
        email: dto.userDTO.email,
        first_name: dto.userDTO.firstName,
        last_name: dto.userDTO.lastName,
        role: dto.userDTO.role,
      },
    });
  });

  it('should throw if required fields are missing', async () => {
    const dto = {
      userDTO: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: '' as unknown,
        verificationToken: '',
      },
    } as CreateUserTransactionDTO;

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

  it('should reject a client without details before consuming OTP or creating an auth user', async () => {
    const dto: CreateUserTransactionDTO = {
      userDTO: {
        email: 'client@test.com',
        password: 'Password1!',
        firstName: 'Client',
        lastName: 'User',
        role: UserRoles.CLIENT,
        verificationToken: 'token',
      },
    };

    await expect(service.createUser(dto)).rejects.toThrow(BadRequestException);
    expect(mockOtp.consumeVerification).not.toHaveBeenCalled();
    expect(mockSupabase.client.auth.signUp).not.toHaveBeenCalled();
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
  });

  it('should complete a client profile left incomplete by the old registration flow', async () => {
    const existingUser = {
      user_id: 'client-123',
      email: 'client@test.com',
      first_name: 'Client',
      last_name: 'User',
      role: UserRoles.CLIENT,
      is_active: true,
    };
    const clientDTO = {
      companyLegalName: 'Client Company',
      companyEmail: 'billing@client.test',
      billablePerson: 'Billing Person',
      contactPerson: 'Contact Person',
      companyContactNumber: '639429459448',
      contactPersonContactNumber: '639429459448',
    };
    const dto: CreateUserTransactionDTO = {
      userDTO: {
        email: 'CLIENT@test.com',
        password: 'Password1!',
        firstName: 'Client',
        lastName: 'User',
        role: UserRoles.CLIENT,
        verificationToken: 'token',
      },
      clientDTO,
    };

    mockPrisma.user.findFirst.mockResolvedValue(existingUser);
    mockPrisma.clients.findUnique.mockResolvedValue(null);

    await expect(service.createUser(dto)).resolves.toEqual(existingUser);
    expect(mockOtp.consumeVerification).toHaveBeenCalledWith(
      'client@test.com',
      UserRoles.CLIENT,
      'token',
    );
    expect(mockPrisma.clients.create).toHaveBeenCalledWith({
      data: {
        user_id: existingUser.user_id,
        company_legal_name: clientDTO.companyLegalName,
        company_email: clientDTO.companyEmail,
        billable_person: clientDTO.billablePerson,
        contact_person: clientDTO.contactPerson,
        company_contact_no: clientDTO.companyContactNumber,
        contact_person_contact_no: clientDTO.contactPersonContactNumber,
      },
    });
    expect(mockSupabase.client.auth.signUp).not.toHaveBeenCalled();
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
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
      userDTO: {
        email: 'john@test.com',
        password: 'Password1!',
        firstName: 'John',
        lastName: 'Eod',
        role: UserRoles.CREATOR,
        verificationToken: 'token',
      },
    } as CreateUserTransactionDTO;

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

  it('should update the authenticated user profile without changing email', async () => {
    const existingUser = {
      user_id: 'abc123',
      email: 'john@test.com',
      first_name: 'John',
      last_name: 'Doe',
      role: UserRoles.CREATOR,
      is_active: true,
    };
    const updatedUser = {
      ...existingUser,
      first_name: 'Jane',
      last_name: 'Smith',
    };

    mockPrisma.user.findFirst.mockResolvedValue(existingUser);
    mockPrisma.user.update.mockResolvedValue(updatedUser);

    await expect(
      service.updateOwnProfile('abc123', {
        firstName: ' Jane ',
        lastName: ' Smith ',
        middleName: ' Q ',
        displayName: ' Jane Smith ',
        primaryHandle: 'jane.smith',
        bio: ' Creator bio ',
        email: 'john@test.com',
        phoneNumber: '639123456789',
        timezone: 'Asia/Manila',
      }),
    ).resolves.toEqual(updatedUser);
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { user_id: 'abc123' },
      data: {
        email: 'john@test.com',
        first_name: 'Jane',
        last_name: 'Smith',
        middle_name: 'Q',
        display_name: 'Jane Smith',
        primary_handle: 'jane.smith',
        bio: 'Creator bio',
        phone_number: '639123456789',
        timezone: 'Asia/Manila',
      },
    });
    expect(
      mockSupabase.adminClient.auth.admin.updateUserById,
    ).not.toHaveBeenCalled();
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
