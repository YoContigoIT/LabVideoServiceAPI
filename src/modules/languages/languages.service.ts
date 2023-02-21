import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parseAffeceRowToHttpResponse } from 'src/utilities/helpers';
import { Repository } from 'typeorm';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { Language } from './entities/language.entity';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language) private languageRepository: Repository<Language>
  ) {}

  create(createLanguageDto: CreateLanguageDto) {
    return this.languageRepository.save(createLanguageDto);
  }

  findAll() {
    return this.languageRepository.find();
  }

  findOne(id: string) {
    return this.languageRepository.findOne({
      where: {id}
    });
  }

  async update(id: string, updateLanguageDto: UpdateLanguageDto) {
    const response = await this.languageRepository
      .createQueryBuilder()
      .update(Language)
      .set(updateLanguageDto)
      .where('id=:id', {id})
      .execute();

      return parseAffeceRowToHttpResponse(response.affected);
  }

  async remove(id: string) {
    const response = await this.languageRepository.softDelete(id);

    return parseAffeceRowToHttpResponse(response.affected);
  }
}
