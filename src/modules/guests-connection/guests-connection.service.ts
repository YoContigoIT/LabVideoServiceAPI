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
import { VideoServiceService } from '../video-service/video-service.service';

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
    private videoService: VideoServiceService,
  ) {
      this.checkRoomsAvailability();

      // this.languagesService.findAll()
      // .then((languages) => {
      //   this.languages = languages;
      //   let list = [];
      //   this.languages.forEach(language => {
      //     this.genders.forEach(gender => {
      //       list.push({
      //         gender,
      //         language: language.title,
      //         priorityLine: new BehaviorSubject<Guest[]>([])
      //       })
      //     })
      //   })
      // this._priorityLine.next([]);
      // });
  }
  
  checkRoomsAvailability() {

    setInterval(() => {
      let availableRooms = this.agentsConnectionService.rooms.filter(room => room.available);      
      if (!availableRooms.length) return;
      availableRooms = shuffleArray(availableRooms);

      console.log('availableRooms', availableRooms);
      
      
      for(let [index, line] of this.priorityLine.entries()) {
        if (!line.priorityLine.value.length) break;

        const guest = this.removeGuestFromAssertivePriorityLine(0, line);
        if (!guest) break;
        
        let availableRoom = availableRooms.find((room) => (room.host.agent.sex === line.gender 
          && room.host.agent.languages[0]?.title === line.language && room.host.agent.role.lowerLimitPriority >= +guest.priority) 
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

  updateGuestConnection(id: string, guestConnectionData: Partial<GuestsConnection>) {
    return this.guestConnectionRepository
      .createQueryBuilder()
      .update(GuestsConnection)
      .set(guestConnectionData)
      .where('id = :id', { id })
      .execute();
  }

  removeGuestFromAssertivePriorityLine(idx: number, priorityLine: PriorityLineList): Guest {
    const line = priorityLine.priorityLine.value;
    const removedGuest = line.splice(idx, 1)[0];
    
    if(line.length === 0) {
      const listIndex = this._priorityLine.value.findIndex((list) => priorityLine.gender === list.gender && priorityLine.language === list.language)
      if(listIndex !== -1) {
        const mainPL = this._priorityLine.value;
        mainPL.splice(listIndex, 1);
        this._priorityLine.next(mainPL);
      }
    } else {
      priorityLine.priorityLine.next(line);
    }

    return removedGuest;
  }

  getGuestIdxBySocketId(socketId: string) {
    for(let line of this.priorityLine) {
      const guest = line.priorityLine.value.findIndex((guest) => guest.socketId === socketId )

      if (guest >= 0) return { guest, priorityLine: line };
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
  
  addGuestToPriorityLine(guest: Guest): any {
    const priorityLine = this.findProperPriorityList(guest);

    this.pushToAssertivePriorityLine(guest, priorityLine.priorityLine);
  }

  findProperPriorityList(guest: Guest) {
    const _$guest = guest.guest;
    
    let priorityLine = this._priorityLine.value.find((list) => {
      return _$guest.gender === list.gender && _$guest.languages[0]?.title === list.language;
    });

    if(priorityLine) return priorityLine;

    priorityLine = {
      gender: _$guest.gender,
      language: _$guest.languages[0]?.title,
      priorityLine: new BehaviorSubject<Guest[]>([])
    }

    this._priorityLine.next([...this._priorityLine.value, priorityLine]);

    return priorityLine;
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
  
  getSessionToReconnect(sessionId: string) {
    const room = this.agentsConnectionService.findRoomBySessionId(sessionId);
    if (!room) return false;

    return {session : this.videoService.getSessionById(sessionId), room };
  }

  findGuestConnectionBySessionId(sessionId: string) {
    return this.guestConnectionRepository.findOne({
      where: {
        sessionId
      }
    })
  }
}
