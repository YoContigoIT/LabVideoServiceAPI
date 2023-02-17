import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parseAffeceRowToHttpResponse } from 'src/utilities/helpers';
import { Repository } from 'typeorm';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository (Setting) private settingsRepository: Repository<Setting>
  ) {}

  getSettings() {
    return this.settingsRepository.findOne({
      where: {id : '1'}
    });
  }

  async update(updateSettingDto: UpdateSettingDto) {
    const response = await this.settingsRepository
      .createQueryBuilder()
      .update(Setting)
      .set(updateSettingDto)
      .where('id = "1"')
      .execute();

    return parseAffeceRowToHttpResponse(response.affected);
  }
}
