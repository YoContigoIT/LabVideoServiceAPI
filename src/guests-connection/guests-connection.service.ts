import { Injectable } from '@nestjs/common';
import { CreateGuestsConnectionDto } from './dto/create-guests-connection.dto';
import { UpdateGuestsConnectionDto } from './dto/update-guests-connection.dto';
import { v4 as uuidv4 } from 'uuid';
import { Guest } from './guests-connection.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { GuestsConnection } from './entities/guests-connection.entity';
import { Repository } from 'typeorm';
import { AgentsConnectionService } from 'src/agents-connection/agents-connection.service';
import { AgentsConnectionGateway } from 'src/agents-connection/agents-connection.gateway';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class GuestsConnectionService {
  private _priorityLine: BehaviorSubject<Guest[]> = new BehaviorSubject<Guest[]>([]);
  priorityLine$: Observable<Guest[]> = this._priorityLine.asObservable();

  constructor(
    @InjectRepository(GuestsConnection) private guestConnectionRepository: Repository<GuestsConnection>,
    private agentsConnectionService: AgentsConnectionService,
    private agentsConnectionGateway: AgentsConnectionGateway,
  ) {
      this.checkRoomsAvailability();
  }
  
  checkRoomsAvailability() {
    setInterval(() => {
      if(!this.priorityLine.length) return;
      console.log('checksRooms');

      this.agentsConnectionService.rooms.value.forEach((room) => {
        if(room.available) {
          const guest = this.priorityLine.shift()
          room.users.push(guest);
          room.available = false;
          this.agentsConnectionGateway.guestInRoom(room.host.socketId, guest);
        }
        console.log(room.users);
      })

      console.log(this.priorityLine, 'priority');
      
    }, 1000);
  }

  create(createGuestsConnectionDto: CreateGuestsConnectionDto) {
    return this.guestConnectionRepository.save(createGuestsConnectionDto); 
  }
  
  // TODO: Manage priority rules
  addGuestToPriorityLine(guest: Guest): any {
    return this.priorityLine.push(guest);
  }

  public get priorityLine() : Guest[] {
    return this._priorityLine.value;
  }
  
}
