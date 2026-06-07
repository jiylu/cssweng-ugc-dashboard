import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // TODO: Safeguard
  @Post()
  create(@Body() dto: CreateUserDTO) {
    return this.userService.createUser(dto);
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.userService.findActiveUserById(userId);
  }

  // TODO: Make /me /update and /deactivate endpoint
}
