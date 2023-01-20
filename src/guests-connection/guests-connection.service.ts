import { Injectable } from '@nestjs/common';
import { CreateGuestsConnectionDto } from './dto/create-guests-connection.dto';
import { UpdateGuestsConnectionDto } from './dto/update-guests-connection.dto';
import { v4 as uuidv4 } from 'uuid';
import { Guest } from './guests-connection.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { GuestsConnection } from './entities/guests-connection.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GuestsConnectionService {
  priorityLine: Guest[] = [];

  constructor(
    @InjectRepository(GuestsConnection) private guestConnectionRepository: Repository<GuestsConnection>
  ) {}

  create(createGuestsConnectionDto: CreateGuestsConnectionDto) {
    return this.guestConnectionRepository.save(createGuestsConnectionDto); 
  }

  // TODO: Manage priority rules
  addGuestToPriorityLine(guest: Guest): any {
    return this.priorityLine.push(guest);
  }
}
