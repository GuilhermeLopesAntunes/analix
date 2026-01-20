import { IsString } from 'class-validator';
import { Manifestacoe } from "src/manifestacoes/entities/manifestacoe.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Label {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @IsString()
  name: string;
  @OneToMany(() => Manifestacoe, (manifest) => manifest.label)
  manifest: Manifestacoe[];
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  //Especifica a coluna que armazena o id dos usuarios
  @JoinColumn({ name: 'user' })
  userCreate: User;
  @Column()
  @IsString()
  colorRgb: string;
}
