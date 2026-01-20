import { IsEmail } from "class-validator";
import { RoutePolices } from "src/auth/enum/route-policies.enum";
import { Label } from "src/label/entities/label.entity";
import { Manifestacoe } from "src/manifestacoes/entities/manifestacoe.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  @IsEmail()
  email: string;
  @Column()
  name: string;
  @Column()
  passwordHash: string;

  //Uma pessoa pode criar varias etiquetas
  @OneToMany(() => Label, (label) => label.userCreate)
  labels: Label[];

  @OneToMany(() => Manifestacoe, (manifest) => manifest.responsavel)
  manifest: Manifestacoe[];

  @Column()
  routePolicies: RoutePolices;
  @Column({ default: true })
  active: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
