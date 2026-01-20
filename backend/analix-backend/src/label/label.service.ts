import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { Repository } from 'typeorm';
import { Label } from './entities/label.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
    private readonly userService: UsersService,
  ) {}
  async create(createLabelDto: CreateLabelDto, tokenPayload: TokenPayloadDto) {
    const label = this.labelRepository.create({
      name: createLabelDto.name,
      colorRgb: createLabelDto.colorRgb,
      userCreate: { id: tokenPayload.sub },
    });

    return this.labelRepository.save(label);
  }

  findAll() {
    return this.labelRepository.find();
  }

  async findOne(id: number) {
    const labels = await this.labelRepository.findOne({ where: { id } });
    if (!labels) {
      throw new NotFoundException('Etiqueta não existe');
    }
    return labels;
  }

  async update(id: number, updateLabelDto: UpdateLabelDto) {
    const labels = await this.labelRepository.findOne({ where: { id }})
    if (!labels) {
      throw new NotFoundException('Essa etiqueta não existe');
    }
    const newData = {
      name: updateLabelDto.name,
      colorRgb: updateLabelDto.colorRgb,
    };
    const newLabel = this.labelRepository.preload({
      id,
      ...newData,
    });
    return newLabel;
  }

  async remove(id: number) {
    const labels = await this.labelRepository.findOne({ where: { id } });
    if (!labels) {
      throw new NotFoundException('Essa etiqueta não existe');
    }
    return await this.labelRepository.remove(labels);
  }
}
