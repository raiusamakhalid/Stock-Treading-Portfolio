import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(@Res() res) {
    const users = await this.userService.findAll();
    return res.status(200).json(users);
  }
  
  @Post()
  async createUser(@Body() userDto: CreateUserDto, @Res() res) {
    const user = await this.userService.create(userDto);
    return res.status(201).json(user);
  }
}
