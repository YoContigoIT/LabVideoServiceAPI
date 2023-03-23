import { Injectable } from "@nestjs/common";
import { Seeder } from "nestjs-seeder";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from "src/modules/users/entities/user.entity";

@Injectable()
export class RootUserSeeder implements Seeder {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

  async seed(): Promise<any> {
    const rootUser: Partial<User> = {
        names: "Administrator",
        lastnames: "Root",
        email: "admin@videoservice.com",
        role: 1 as any,
        password: "$2b$10$gxSKCI9iGkHy.Sx.SpPp..8554wEDUfMSsrO3xoDAzBNZyw4i0rtS"
    };

    // Insert into the database.
    const user = this.userRepository.create(rootUser);
    return this.userRepository.insert(user);
  }

  async drop(): Promise<any> {
    this.userRepository.createQueryBuilder()
        .delete().where("email = admin@videoservice.com").execute()
  }
}