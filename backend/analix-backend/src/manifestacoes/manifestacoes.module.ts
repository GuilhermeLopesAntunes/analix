import { Module } from '@nestjs/common';
import { ManifestacoesService } from './manifestacoes.service';
import { ManifestacoesController } from './manifestacoes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manifestacoe } from './entities/manifestacoe.entity';
import { LabelModule } from 'src/label/label.module';
import { Label } from 'src/label/entities/label.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Manifestacoe, Label]), LabelModule, UsersModule],
  controllers: [ManifestacoesController],
  providers: [ManifestacoesService],
})
export class ManifestacoesModule {}
