import { IsDateString, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { Label } from "src/label/entities/label.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Manifestacoe {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Label)
  @JoinColumn({ name: 'Etiqueta' })
  label: Label;
  @Column({ unique: true })
  @IsString()
  protocolo: string;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  responsavel: User;
  @Column()
  @IsDateString()
  dataManifestacao: Date;
  @Column()
  @IsNumber()
  periodo: number;
  @Column()
  @IsString()
  processoSei: string;
  @Column()
  @IsString()
  status: string;
  @Column()
  @IsString()
  arquivo: string;
  @CreateDateColumn()
  createdAt?: Date;
  @Column()
  @IsString()
  desc: string;
  @UpdateDateColumn()
  updatedAt?: Date;
}
