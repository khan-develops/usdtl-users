import { Body, Controller, Get, Post } from '@nestjs/common';
import { get } from 'http';
import { UserService } from './user.service';

@Controller()
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Post('/login')
  signin(
    @Body('username') username: string,
    @Body('password') password: string
    ): Promise<{ accessToken: string }> {
    return this.userService.signin(username, password)
  }
}
