import { Role } from '../auth/rbac/role/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['email'])
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  username?: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ default: false })
  acceptedTerms: boolean;

  @Column({ default: false })
  acceptedPrivacyPolicy: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  role: Role;
}
