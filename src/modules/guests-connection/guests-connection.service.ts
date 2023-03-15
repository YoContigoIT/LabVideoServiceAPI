import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { CreateGuestsConnectionDto } from './dto/create-guests-connection.dto';
import { Guest } from './guests-connection.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { GuestsConnection } from './entities/guests-connection.entity';
import { Repository } from 'typeorm';
import { AgentsConnectionService } from 'src/modules/agents-connection/agents-connection.service';
import { AgentsConnectionGateway } from 'src/modules/agents-connection/agents-connection.gateway';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Room } from 'src/modules/agents-connection/agents-connection.interface';
import { LanguagesService } from '../languages/languages.service';
import { Language } from '../languages/entities/language.entity';
import { parseAffeceRowToHttpResponse, shuffleArray } from 'src/utilities/helpers';

type PriorityLineList = {
  gender: string;
  language: string;
  priorityLine: BehaviorSubject<Guest[]>
}

@Injectable()
export class GuestsConnectionService {
  // private _priorityLine: BehaviorSubject<Guest[]> = new BehaviorSubject<Guest[]>([]);
  // priorityLine$: Observable<Guest[]> = this._priorityLine.asObservable();

  genders = ['MALE', 'FEMALE'];

  private languages: Language[];

  private _priorityLine: BehaviorSubject<PriorityLineList[]> = new BehaviorSubject<PriorityLineList[]>([]);
  priorityLine$: Observable<PriorityLineList[]> = this._priorityLine.asObservable();

  constructor(
    @InjectRepository(GuestsConnection) private guestConnectionRepository: Repository<GuestsConnection>,
    @Inject(forwardRef(() => AgentsConnectionService))
    private agentsConnectionService: AgentsConnectionService,
    @Inject(forwardRef(() => AgentsConnectionGateway))
    private agentsConnectionGateway: AgentsConnectionGateway,
    private languagesService: LanguagesService
  ) {
      this.checkRoomsAvailability();

      this.languagesService.findAll()
      .then((languages) => {
        this.languages = languages;
        let list = [];
        this.languages.forEach(language => {
          this.genders.forEach(gender => {
            list.push({
              gender,
              language: language.title,
              priorityLine: new BehaviorSubject<Guest[]>([])
            })
          })
        })
        
        this._priorityLine.next(list);
      });
  }
  
  checkRoomsAvailability() {

    setInterval(() => {
      let availableRooms = this.agentsConnectionService.rooms.filter(room => room.available);      
      if (!availableRooms.length) return;
      availableRooms = shuffleArray(availableRooms);

      for(let [index, line] of this.priorityLine.entries()) {
        if (!line.priorityLine.value.length) break;

        const guest = this.removeGuestFromAssertivePriorityLine(0, line.priorityLine);
        if (!guest) break;
        
        let availableRoom = availableRooms.find((room) => (room.host.agent.sex === line.gender 
          && room.host.agent.languages[0].title === line.language && room.host.agent.role.lowerLimitPriority >= +guest.priority) 
          || (room.host.agent.sex === line.gender && room.host.agent.role.lowerLimitPriority >= +guest.priority))
          
        if (!availableRoom) {
          availableRoom = availableRooms[0];
        }

        availableRoom.users.push(guest);
        availableRoom.available = false;

        const pl = this.priorityLine;
        
        pl[index] = line;
        this._priorityLine.next(pl);
        this.agentsConnectionGateway.guestInRoom(availableRoom, guest);
      }
        
      this.agentsConnectionService.updateRoomsList(this.agentsConnectionService.rooms);
    }, 3000);
  }

  pushToAssertivePriorityLine(guest: Guest, priorityLine: BehaviorSubject<Guest[]>) {
    priorityLine.pipe(take(1)).subscribe(previusVal => {
      const newArr = [...previusVal, guest];
      const sortedArray = newArr.sort((a, b) => parseInt(a.priority) - parseInt(b.priority));
      priorityLine.next(sortedArray);
    })
  }

  create(createGuestsConnectionDto: CreateGuestsConnectionDto) {    
    return this.guestConnectionRepository.save(createGuestsConnectionDto); 
  }

  async updateGuestConnection(id: string) {
    const guestConnectionData = {
      endTimeConnection: new Date()
    }

    const response = await this.guestConnectionRepository
      .createQueryBuilder()
      .update(GuestsConnection)
      .set(guestConnectionData)
      .where('id = :id', { id })
      .execute();

    return parseAffeceRowToHttpResponse(response.affected);
  }

  removeGuestFromAssertivePriorityLine(idx: number, priorityLine: BehaviorSubject<Guest[]>): Guest {
    const line = priorityLine.value;
    const removedGuest = line.splice(idx, 1)[0];
    priorityLine.next(line);
    return removedGuest;
  }

  getGuestIdxBySocketId(socketId: string) {
    for(let line of this.priorityLine) {
      const guest = line.priorityLine.value.findIndex((guest) => guest.socketId === socketId )

      if (guest >= 0) return { guest, priorityLine: line.priorityLine };
    }

    return -1;
  }

  getGuestBySocketId(socketId: string) {
    for(let line of this.priorityLine) {
      const guest = line.priorityLine.value.find((guest) => guest.socketId === socketId )
      if (guest) return guest;
    }
    return undefined;
  }
  
  // TODO: Manage priority rules
  addGuestToPriorityLine(guest: Guest): any {
    const priorityLine = this.findProperPriorityList(guest);

    this.pushToAssertivePriorityLine(guest, priorityLine.priorityLine);
  }

  findProperPriorityList(guest: Guest) {
    const _$guest = guest.guest;
    
    return this._priorityLine.value.find((list) => {
      return _$guest.gender === list.gender && _$guest.languages[0].title === list.language;
    });
  }

  getRoomByGuestSocket(socketId: string) {
    return this.agentsConnectionService.rooms.find(room => room.users.find(user => user.socketId === socketId));
  }
  
  updateRoomGuest(room: Room) {
    if (!room) return;
  
    room.users = [];
    room.available = true;
  
    this.agentsConnectionService.updateRoom(room.name, room);
  }

  public get priorityLine() : PriorityLineList[] {
    return this._priorityLine.value;
  }
  
}
