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
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  @Put('profile')
  updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.id, dto);
  }
}
