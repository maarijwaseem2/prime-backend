import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password'], // Explicitly select password for validation
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret:
            this.configService.get<string>('JWT_REFRESH_SECRET') ||
            this.configService.get<string>('JWT_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, { hashedRefreshToken });
  }

  async login(user: any) {
    const tokens = await this.getTokens(user.id, user.email);
    await this.setCurrentRefreshToken(tokens.refresh_token, user.id);
    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'name', 'email', 'hashedRefreshToken'],
    });

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException();
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
    throw new UnauthorizedException();
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      hashedRefreshToken: null,
    });
  }

  // Temporary method to create the first admin user
  async register(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async updateProfile(
    userId: number,
    updateData: { name?: string; email?: string; password?: string },
  ) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    if (updateData.name) user.name = updateData.name;
    if (updateData.email) user.email = updateData.email;
    if (updateData.password) {
      user.password = await bcrypt.hash(updateData.password, 10);
    }
    await this.usersRepository.save(user);
    const { password, ...result } = user;
    return result;
  }

  async deleteProfile(userId: number) {
    const result = await this.usersRepository.delete(userId);
    return { deleted: (result.affected ?? 0) > 0 };
  }
}
