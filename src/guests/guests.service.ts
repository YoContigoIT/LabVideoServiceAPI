import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Guest } from './entities/guest.entity';
import { HttpStatusResponse } from 'src/common/interfaces/http-responses.interface';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest) private guestRepository: Repository<Guest>
  ) {}
  create(createGuestDto: CreateGuestDto): Promise<CreateGuestDto> {
    return this.guestRepository.save(createGuestDto);
  }

  findAll(): Promise<Guest[]> {
    return this.guestRepository.find();
  }

  findOne(uuid: string): Promise<Guest> {
    return this.guestRepository.findOne({
      where: {uuid}
    });
  }

  async updateGuest(uuid: string, updateGuestDto: UpdateGuestDto) {
    const response = await this.guestRepository
      .createQueryBuilder()
      .update(Guest)
      .set(updateGuestDto)
      .where('uuid =:uuid', {uuid})
      .execute();

      return this.parseAffeceRowToHttpResponse(response.affected);
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
