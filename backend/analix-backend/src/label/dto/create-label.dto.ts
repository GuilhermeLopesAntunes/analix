import { IsPositive, IsString } from 'class-validator';
import { Manifestacoe } from 'src/manifestacoes/entities/manifestacoe.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateLabelDto {
@IsString()
name: string;
@IsString()
colorRgb: string;
}
