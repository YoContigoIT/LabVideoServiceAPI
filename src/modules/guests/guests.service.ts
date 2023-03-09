import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Guest } from './entities/guest.entity';
import { HttpStatusResponse } from 'src/common/interfaces/http-responses.interface';
import { Language } from '../languages/entities/language.entity';
import { LanguagesService } from '../languages/languages.service';
import { GetGuestsDto } from './dto/get-guest.dto';
import { paginatorResponse } from 'src/utilities/helpers';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest) private guestRepository: Repository<Guest>,
    private languagesService: LanguagesService,
  ) {}
  async create(createGuestDto: CreateGuestDto): Promise<CreateGuestDto> {
    const languages: Language[] = [];
    for(let language of createGuestDto.languages) { 
      languages.push(await this.languagesService.findOne(language.toString()))
    }

    const agent = this.guestRepository.create(createGuestDto);

    agent.languages = languages;

    return this.guestRepository.save(agent);
  }

  async findAll(query: GetGuestsDto) {
    let where = []
    const take = query.pageSize || 10;
    const page = query.pageIndex || 0;
    const skip = page*take;

    if(query.search) {
      where.push({ name: Like(`%${query.search}%`) });
      where.push({ details: Like(`%${query.search}%`) });
    }

    const data = await this.guestRepository.findAndCount({
      take: query.paginate ? take : 0,
      skip: query.paginate ? skip : 0,
      where: where.length ? where : {}
    });

    return paginatorResponse(data, page, take);
  }

  findOne(uuid: string): Promise<Guest> {
    return this.guestRepository.findOne({
      where: {uuid}
    });
  }

  async updateGuest(uuid: string, updateGuestDto: UpdateGuestDto) {
    let agent = await this.guestRepository.findOne({ where: {uuid}});  
    
    const languages: Language[] = [];
    for(let language of updateGuestDto.languages) { 
      languages.push(await this.languagesService.findOne(language.toString()))
    }
    
    agent.languages = languages;
    delete updateGuestDto.languages;
    const response = await this.guestRepository.save({...agent, ...updateGuestDto})

    return this.parseAffeceRowToHttpResponse(response.uuid ? 1 : 0);
  }

  async removeGuest(uuid: string) {
    const response = await this.guestRepository.softDelete(uuid)

    return this.parseAffeceRowToHttpResponse(response.affected);
  }

  private parseAffeceRowToHttpResponse(affected: number) {
    return affected === 1 ? {
      status: HttpStatusResponse.SUCCESS
    }: {
      status: HttpStatusResponse.FAIL
    } ;
  }
}
