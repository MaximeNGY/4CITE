import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../auth/rbac/role/role.entity';
import { User } from '../users/users.entity';
import * as bcrypt from 'bcrypt';
import { Claim } from '@/auth/rbac/claims.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
    await this.seedAdminUser();
  }

  private async seedRoles() {
    const roles = ['User', 'Admin'];

    for (const roleName of roles) {
      const exists = await this.roleRepository.findOne({
        where: { name: roleName },
      });
      if (!exists) {
        const newRole = this.roleRepository.create({
          name: roleName,
          claims:
            roleName === 'Admin'
              ? [Claim.WRITE_ANY_USER]
              : [Claim.READ_OWN_USER],
        });
        await this.roleRepository.save(newRole);
        console.log(`✅ Role created: ${roleName}`);
      }
    }
  }

  private async seedAdminUser() {
    const adminEmail = 'admin@example.com';
    const existingAdmin = await this.userRepository.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      const adminRole = await this.roleRepository.findOne({
        where: { name: 'Admin' },
      });

      if (!adminRole) {
        console.error('❌ No "Admin" role found. Run migrations first.');
        return;
      }

      const adminUser = this.userRepository.create({
        username: 'admin',
        email: adminEmail,
        password: hashedPassword,
        role: adminRole,
        acceptedTerms: true,
        acceptedPrivacyPolicy: true,
      });

      await this.userRepository.save(adminUser);
      console.log(`✅ Admin user created: ${adminEmail}`);
    }
  }
}
