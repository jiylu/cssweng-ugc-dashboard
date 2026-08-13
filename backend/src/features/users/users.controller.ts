import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { UserService } from './users.service';
import { LoginUserDTO } from './dto/login-user.dto';
import {
  serializeAuthCookie,
  serializeExpiredAuthCookie,
} from './utils/auth-cookie';
import type { AuthenticatedRequest } from './types/authenticated-request.types';
import { CreateUserTransactionDTO } from './dto/create-user-transaction.dto';
import { ApiCreateUser } from './docs/users.controller.swagger';
import { UpdateOwnProfileDTO } from './dto/update-own-profile.dto';
import { SupabaseStorageService } from 'src/shared/supabase-storage/supabase-storage.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly storageService: SupabaseStorageService,
  ) {}
  // TODO: Safeguard
  @ApiCreateUser()
  @Post()
  create(@Body() dto: CreateUserTransactionDTO) {
    return this.userService.createUser(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.userService.login(dto);
    // TODO: Revisit persistent-session length with the Asceoft's security policy. Current remember-me duration is 30 days for testing.
    const rememberMe = Boolean(dto.rememberMe);

    res.setHeader(
      'Set-Cookie',
      serializeAuthCookie(
        {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          rememberMe,
        },
        rememberMe,
      ),
    );

    return {
      user: data.user,
    };
  }

  @Get('me')
  me(@Req() req: AuthenticatedRequest) {
    return req.authUser;
  }

  @Patch('me')
  updateMe(@Req() req: AuthenticatedRequest, @Body() dto: UpdateOwnProfileDTO) {
    return this.userService.updateOwnProfile(req.authUser.user_id, dto);
  }

  @Post('me/profile-picture')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  async uploadProfilePicture(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file?.mimetype.startsWith('image/')) {
      throw new BadRequestException({
        code: 'IMAGE_REQUIRED',
        message: 'Upload a valid image file.',
      });
    }

    const upload = await this.storageService.upload(
      file,
      `profile-pictures/${req.authUser.user_id}`,
    );
    return this.userService.updateProfilePicture(
      req.authUser.user_id,
      upload.publicUrl,
    );
  }

  @Delete('me/profile-picture')
  removeProfilePicture(@Req() req: AuthenticatedRequest) {
    return this.userService.updateProfilePicture(
      req.authUser.user_id,
      UserService.DEFAULT_PROFILE_PICTURE_URL,
    );
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.setHeader('Set-Cookie', serializeExpiredAuthCookie());

    return {
      message: 'Logged out',
    };
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.userService.findActiveUserById(userId);
  }

  // TODO: Make /me /update and /deactivate endpoint
}
