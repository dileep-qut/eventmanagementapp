import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiResponse } from '@nestjs/swagger';

@ApiResponse({
  status: 400,
  description: 'Bad request',
  example: {
    statusCode: 400,
    message: 'Invalid credentials',
    error: 'Bad Request',
  },
})
@ApiResponse({
  status: 401,
  description: 'Invalid credentials',
  example: {
    statusCode: 401,
    message: 'Invalid credentials',
    error: 'Unauthorized',
  },
})
@ApiResponse({
  status: 500,
  description: 'Internal server error',
  example: {
    statusCode: 500,
    message: 'Internal server error',
    error: 'Internal Server Error',
  },
})
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiResponse({
    status: 200,
    description: 'Login successful',
    example: {},
  })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  @Put('profile')
  updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.id, dto);
  }
}
