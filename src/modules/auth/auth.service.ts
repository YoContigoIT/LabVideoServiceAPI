import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ApiKeyService } from '../api-key/api-key.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private apiKeyService: ApiKeyService,
  ) {}

  async checkUserExists(email: string): Promise<User> {
    const userInfo = await this.userRepository.findOne({
      where: { email: email },
    });

    return userInfo;
  }

  async validateApiKey(apikey: string) {
    return this.apiKeyService.findOne(apikey);
  }
}
