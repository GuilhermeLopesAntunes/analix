import { ForbiddenException, HttpCode, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { RoutePolices } from 'src/auth/enum/route-policies.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createUserDto.password,
      );
      const userData = {
        name: createUserDto.name,
        passwordHash,
        email: createUserDto.email,
        routePolicies: createUserDto.routePolicies,
      };
      const newUser = this.userRepository.create(userData);
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      if (error.code == 'ER_DUP_ENTRY') {
        throw new HttpException('Email já existe', HttpStatus.CONFLICT);
      }
    }
  }

  async findAll() {
    const users = await this.userRepository.find({
      order: {
        id: 'desc',
      },
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Pessoa não encontrada');
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const newData = {
      name: updateUserDto.name,
      email: updateUserDto.email,
      routePolicies: updateUserDto.routePolicies,
    };
    if (updateUserDto?.password) {
      const passwordHash = await this.hashingService.hash(
        updateUserDto.password,
      );
      newData['passwordHash'] = passwordHash;
    }
    const user = await this.userRepository.preload({
      id,
      ...newData,
    });
    if (!user) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    if (
      tokenPayload.routePolicies !== RoutePolices.admin /*&&
      user.id !== tokenPayload.sub*/
    ) {
      throw new ForbiddenException('Sem permissão');
    }

    return this.userRepository.save(user);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Pessoa Não Econtrado');
    }
    if (
      tokenPayload.routePolicies !== RoutePolices.admin /*&&
      user.id !== tokenPayload.sub*/
    ) {
      throw new ForbiddenException('Sem permissão');
    }
    return this.userRepository.remove(user);
  }
}
