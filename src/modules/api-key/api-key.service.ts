import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getUuidv4 } from 'src/utilities/helpers';
import { Repository } from 'typeorm';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { ApiKey } from './entities/api-key.entity';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey) private apiKeyrepository: Repository<ApiKey> 
  ) {}

  async create(createApiKeyDto: CreateApiKeyDto) {
    const prevousApiKeys = await this.apiKeyrepository.find({where : { clientId : createApiKeyDto.clientId }});
    prevousApiKeys.forEach(async key => {
      await this.remove(key.id);
    });

    const secretKey = await this.generateSecretKey(createApiKeyDto);
    const publicKey = await this.generatePublicKey(createApiKeyDto);

    return {
      secretKey : secretKey.apikey,
      publicKey : publicKey.apikey
    }
  }

  findAll() {
    return this.apiKeyrepository.find();
  }

  findOne(apikey: string) {
    return this.apiKeyrepository.findOne({ where: { apikey }})
  }

  async remove(id: number) {
    return this.apiKeyrepository.softDelete(id);
  }

  async generatePublicKey(createApiKeyDto) {
    const publicUuid = await getUuidv4();
    return this.apiKeyrepository.save({...createApiKeyDto, apikey: `vspk_${publicUuid}`, type: 'public' })
  }

  async generateSecretKey(createApiKeyDto) {
    const secretUuid = await getUuidv4();
    return this.apiKeyrepository.save({...createApiKeyDto, apikey: `vssk_${secretUuid}`, type:'secret' })
  }

  getPublicKey(clientId: string) {
    return this.apiKeyrepository.findOne({ where : { clientId : clientId, type : 'public' }});
  }

  isKeyValid(apikey: string) {
    return this.apiKeyrepository.findOneOrFail({ where : { apikey }});
  }
}
