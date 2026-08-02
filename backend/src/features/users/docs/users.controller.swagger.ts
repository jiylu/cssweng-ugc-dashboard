import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserTransactionDTO } from '../dto/create-user-transaction.dto';
import { UserRoles } from '@prisma/client';

export function ApiCreateUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Creates a user account',
      description:
        'Creates a new user using CreateUserTransactionDTO. The request body requires a `userDTO` object (email, password, firstName, lastName, role, and a verificationToken obtained after validating the email OTP). The endpoint validates the OTP verification token and checks for existing emails before creating the auth and database user. When `userDTO.role` is CLIENT, a `clientDTO` object with client details must also be provided and is persisted alongside the user.',
    }),
    ApiBody({
      type: CreateUserTransactionDTO,
      description:
        'User creation payload. `userDTO` is required; `clientDTO` is required only when the user role is CLIENT.',
      examples: {
        creator: {
          summary: 'Create a CREATOR user',
          value: {
            userDTO: {
              email: 'creator@example.com',
              password: 'StrongPass123',
              firstName: 'Alyssa',
              lastName: 'Cruz',
              role: UserRoles.CREATOR,
              verificationToken: 'otp-verification-token',
            },
          },
        },
        client: {
          summary: 'Create a CLIENT user with client details',
          value: {
            userDTO: {
              email: 'client@example.com',
              password: 'StrongPass123',
              firstName: 'Maria',
              lastName: 'Santos',
              role: UserRoles.CLIENT,
              verificationToken: 'otp-verification-token',
            },
            clientDTO: {
              companyLegalName: 'Asceoft Marketing Inc.',
              companyEmail: 'finance@client.com',
              billablePerson: 'Maria Santos',
              contactPerson: 'Juan Dela Cruz',
              companyContactNumber: 1234567890,
              contactPersonContactNumber: 9876543210,
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'User created successfully',
    }),
    ApiResponse({
      status: 400,
      description:
        'Invalid request payload, missing client details for a CLIENT user, or auth signup error.',
    }),
    ApiResponse({
      status: 409,
      description:
        'Conflict if the email already exists or is already registered with the auth provider.',
    }),
  );
}
