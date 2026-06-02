import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // TODO: Safeguard
  @Post('create-user')
  async createUser(@Body() dto: CreateUserDTO) {
    return await this.userService.createUser(dto);
  }

  @Get(':userId')
  async findUser(@Param('userId') userId: string) {
    return await this.userService.findActiveUserById(userId);
  }

  // TODO: Make /me /update and /deactivate endpoint
}
