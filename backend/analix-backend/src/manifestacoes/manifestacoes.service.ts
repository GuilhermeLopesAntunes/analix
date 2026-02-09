import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateManifestacoeDto } from './dto/create-manifestacoe.dto';
import { UpdateManifestacoeDto } from './dto/update-manifestacoe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Manifestacoe } from './entities/manifestacoe.entity';
import { Repository } from 'typeorm';
import { LabelService } from 'src/label/label.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import * as path from 'path';
import * as fs from 'fs/promises';
import { randomUUID } from 'crypto';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ManifestacoesService {
  constructor(
    @InjectRepository(Manifestacoe)
    private readonly manifestacaoRepository: Repository<Manifestacoe>,
    private readonly labelRepository: LabelService,
    private readonly userRepository: UsersService,
  ) {}

  async create(
    createManifestacoeDto: CreateManifestacoeDto,
    tokenPayload: TokenPayloadDto) {
    try {
      const data = new Date(createManifestacoeDto.dataManifestacao);
      const { idEtiqueta } = createManifestacoeDto;
      const label = await this.labelRepository.findOne(idEtiqueta);
      const hoje = new Date();
      const diffMs = hoje.getTime() - data.getTime();
      const periodo = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const responsavel = await this.userRepository.findOne(tokenPayload.sub);
      const manifestacaoData = {
        protocolo: createManifestacoeDto.protocolo,
        label,
        dataManifestacao: data,
        processoSei: createManifestacoeDto.processoSei,
        status: createManifestacoeDto.status,
        arquivo: createManifestacoeDto.arquivo,
        periodo: periodo,
        desc: createManifestacoeDto.desc,
        responsavel,
      };
      const newManifestacao =
        this.manifestacaoRepository.create(manifestacaoData);
      await this.manifestacaoRepository.save(newManifestacao);

      return newManifestacao;
    } catch (error) {
      console.log(error);
      if (error.code == 'ER_DUP_ENTRY') {
        throw new ConflictException('Essa manifestação já existe');
      }
      throw error;
    }
  }

  async findAll(paginationDto?: PaginationDto) {
    const limit = paginationDto?.limit ?? 10;
    const offset = paginationDto?.offset ?? 0;
    const manifestacao = await this.manifestacaoRepository.find({
      take: limit,
      skip: offset,
      relations: { label: true, responsavel: true },
    });
    return manifestacao;
  }

  async findOne(id: number) {
    const manifest = await this.manifestacaoRepository.findOne({ where: {id} });
    if(!manifest) {
      throw new NotFoundException('Manifestação Não encontrada');
    }
    return manifest

  }

  async update(id: number, updateManifestacoeDto: UpdateManifestacoeDto) {
    const manifestacaoData = {
      status: updateManifestacoeDto.status,
      protocolo: updateManifestacoeDto.protocolo,
      desc: updateManifestacoeDto.desc,
      processoSei: updateManifestacoeDto.processoSei,
      dataManifestacao: updateManifestacoeDto.dataManifestacao
        ? new Date(updateManifestacoeDto.dataManifestacao)
        : undefined,
    };

    const manifestacao = await this.manifestacaoRepository.preload({
      id,
      ...manifestacaoData,
    });

    if (!manifestacao) {
      throw new NotFoundException('Manifestação não encontrada');
    }

    return this.manifestacaoRepository.save(manifestacao);
  }
  async remove(id: number) {
    const manifestacao = await this.manifestacaoRepository.findOneBy({
      id,
    });
    if (!manifestacao) {
      throw new NotFoundException('Manifestação não encontrada');
    }
    if (manifestacao.arquivo) {
      const filePath = path.resolve(
        process.cwd(),
        manifestacao.arquivo.replace(/^\/+/, ''),
      );
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Erro ao deletar o arquivo:', error.message);
      }
      return this.manifestacaoRepository.remove(manifestacao);
    }
  }

  async updateLabel(manifestId: number, labelId: number) {
    const manifest = await this.manifestacaoRepository.findOne({
      where: { id: manifestId },
      relations: ['label'],
    });

    if (!manifest) {
      throw new NotFoundException('Manifestação não encontrada');
    }

    const label = await this.labelRepository.findOne(labelId);

    if (!label) {
      throw new NotFoundException('Etiqueta não encontrada');
    }

    manifest.label = label;
    return this.manifestacaoRepository.save(manifest);
  }

  async uploadManifest(file: Express.Multer.File) {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const fileName = `${randomUUID()}${fileExtension}`;
    const fileFullPath = path.resolve(
      process.cwd(),
      'uploads',
      'manifestacoes',
      fileName,
    );
    await fs.mkdir(path.dirname(fileFullPath), { recursive: true });
    await fs.writeFile(fileFullPath, file.buffer);
    return {
      filename: fileName,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: `/uploads/manifestacoes/${fileName}`,
    };
  }

  async updateUpload(id: number, file: Express.Multer.File) {
    const manifest = await this.manifestacaoRepository.findOne({
      where: { id },
    });

    if (!manifest) {
      throw new NotFoundException('Manifestação não encontrada');
    }
    if (manifest.arquivo) {
      const oldPath = path.resolve(
        process.cwd(),
        manifest.arquivo.replace(/^\/+/, ''),
      );
      try {
        await fs.unlink(oldPath);
      } catch (err) {
        console.warn('Arquivo antigo não encontrado:', err.message);
      }
    }
    const extension = path.extname(file.originalname).toLowerCase();
    const fileName = `${randomUUID()}${extension}`;
    const fullPath = path.resolve(
      process.cwd(),
      'uploads',
      'manifestacoes',
      fileName,
    );

    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    await fs.writeFile(fullPath, file.buffer);
    const newPath = `/uploads/manifestacoes/${fileName}`;
    manifest.arquivo = newPath;
    await this.manifestacaoRepository.save(manifest);
    return {
      message: 'Arquivo atualizado com sucesso',
      path: newPath,
    };
  }
}
