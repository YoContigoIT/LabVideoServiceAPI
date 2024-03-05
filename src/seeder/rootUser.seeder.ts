import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class RootUserSeeder implements Seeder {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async drop(): Promise<any> {
    await this.userRepository.query(
      `DELETE FROM user WHERE names='Administrator'`,
    );
  }

  async seed(): Promise<any> {
    const rootUser: Partial<User> = {
      names: 'Administrator',
      lastnames: 'Root',
      email: 'admin@videoservice.com',
      roleId: 1 as any,
      password: '$2b$10$gxSKCI9iGkHy.Sx.SpPp..8554wEDUfMSsrO3xoDAzBNZyw4i0rtS',
    };

    // Insert into the database.
    const user = this.userRepository.create(rootUser);
    return this.userRepository.insert(user);
  }
}
