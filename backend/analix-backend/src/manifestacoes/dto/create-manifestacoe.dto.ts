import { IsDateString, IsPositive, IsString } from "class-validator";
import { Label } from "src/label/entities/label.entity";

export class CreateManifestacoeDto {
  @IsString()
  protocolo: string;
  @IsDateString()
  dataManifestacao: Date;
  @IsString()
  processoSei: string;
  @IsString()
  status: string;
  @IsString()
  arquivo: string;
  @IsString()
  desc: string;
  @IsPositive()
  idEtiqueta: number;
}
