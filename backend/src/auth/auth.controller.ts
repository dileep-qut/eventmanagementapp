import { Controller, Post, Get, Put, Body, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ApplyApiResponse } from '@/_decorators/apply-api-response.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApplyApiResponse([400, 403, 500])
  @ApiResponse({
    status: 201,
    description: 'Login successful',
    schema: {
      example: {
        id: 'MongoDB ObjectId',
        name: 'dev',
        email: 'dev@qut.edu.au',
        token: 'This is a JWT token',
      },
    },
  })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApplyApiResponse([400, 401, 500])
  @ApiResponse({
    status: 201,
    description: 'Login successful',
    schema: {
      example: {
        id: 'MongoDB ObjectId',
        name: 'dev',
        email: 'dev@qut.edu.au',
        token: 'This is a JWT token',
      },
    },
  })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApplyApiResponse([400, 401, 403, 500])
  @ApiResponse({
    status: 200,
    description: 'Get user profile',
    schema: {
      example: {
        _id: '6811a67495c4b721f28e63ca',
        name: 'John Doe',
        email: 'n123456789@qut.edu.au',
        createdAt: '2025-04-30T04:26:28.408Z',
        updatedAt: '2025-04-30T04:26:28.408Z',
      },
    },
  })
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user._id);
  }

  @ApplyApiResponse([400, 401, 403, 500])
  @ApiResponse({
    status: 200,
    description: 'Get user profile',
    schema: {
      example: {
        _id: '6811a67495c4b721f28e63ca',
        name: 'John Doe',
        email: 'n123456789@qut.edu.au',
        createdAt: '2025-04-30T04:26:28.408Z',
        updatedAt: '2025-04-30T04:26:28.408Z',
      },
    },
  })
  @ApiBearerAuth()
  @Put('profile')
  updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user._id, dto);
  }
}
