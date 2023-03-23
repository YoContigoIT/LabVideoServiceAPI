import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ApiKeyService } from '../api-key/api-key.service';
import { ApiKey } from '../api-key/entities/api-key.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) 
    private userRepository: Repository<User>,
    private apiKeyService: ApiKeyService
  ){}

  async checkUserExists(email: string): Promise<User> {
    const userInfo = await this.userRepository.findOne(
        {where: {email: email}}
    )

    return userInfo;
  }

  async validateApiKey(apikey: string){
    return this.apiKeyService.findOne(apikey);
  }
}
