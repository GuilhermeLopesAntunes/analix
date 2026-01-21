import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import * as config from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';

interface JwtPayload {
  sub: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: config.ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {
    console.log(jwtConfiguration);
  }
  async login(loginDto: LoginDto) {
    let passwordIsValid = false;
    let throwError = true;

    const user = await this.userRepository.findOneBy({
      email: loginDto.email,
    });
    if (!user) {
      throw new NotFoundException('Usuário não existe');
    }

    if (user) {
      passwordIsValid = await this.hashingService.compare(
        loginDto.password,
        user.passwordHash,
      );
    }
    if (passwordIsValid) {
      throwError = false;
    }
    if (throwError) {
      throw new UnauthorizedException('Usuário ou senha invalidos');
    }
    return this.createTokens(user);
  }
  private async createTokens(user: User) {
    const access_token = await this.signJwtAsync<Partial<User>>(
      user.id,
      this.jwtConfiguration.jwtTtl,
      {
        email: user?.email,
        routePolicies: user?.routePolicies,
      },
    );
    const refresh_token = await this.signJwtAsync(
      user.id,
      this.jwtConfiguration.jwtRefreshTtl,
    );
    return {
      access_token,
      refresh_token,
    };
  }
  private async signJwtAsync<T>(sub: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issue,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshTokenDto.refresh_token,
        this.jwtConfiguration,
      );

      const user = await this.userRepository.findOneBy({
        id: payload.sub,
      });

      if (!user) {
        throw new Error('Pessoa Não Encontrada');
      }

      return this.createTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
