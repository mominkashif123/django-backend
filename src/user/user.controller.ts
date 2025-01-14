import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.userService.signup(email, password);
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body('email') email: string,
    @Body('otp') otp: string,
  ) {
    return this.userService.verifyOtp(email, otp);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.userService.login(email, password);
  }
}
