import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshAuthGuard } from './jwt-refresh-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Admin Login' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    return this.authService.login(user);
  }

  @Post('seed-admin') // Temporary route to create initial admin
  @ApiOperation({ summary: 'Seed initial Admin (Development only)' })
  async seed() {
    return this.authService.register('Admin', 'admin@prime.com', 'admin123');
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiBody({ schema: { properties: { refreshToken: { type: 'string' } } } })
  async refresh(@Request() req) {
    const tokens = await this.authService.getTokens(
      req.user.id,
      req.user.email,
    );
    await this.authService.setCurrentRefreshToken(
      tokens.refresh_token,
      req.user.id,
    );
    return tokens;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  async logout(@Request() req) {
    await this.authService.removeRefreshToken(req.user.userId);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get logged in Admin profile' })
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update logged in Admin profile' })
  updateProfile(
    @Request() req,
    @Body() updateData: { name?: string; email?: string; password?: string },
  ) {
    return this.authService.updateProfile(req.user.userId, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete logged in Admin profile' })
  deleteProfile(@Request() req) {
    return this.authService.deleteProfile(req.user.userId);
  }
}
