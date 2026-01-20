import { PartialType } from '@nestjs/mapped-types';
import { CreateManifestacoeDto } from './create-manifestacoe.dto';

export class UpdateManifestacoeDto extends PartialType(CreateManifestacoeDto) {}
