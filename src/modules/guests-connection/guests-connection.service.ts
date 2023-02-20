import { Injectable } from '@nestjs/common';
import { CreateGuestsConnectionDto } from './dto/create-guests-connection.dto';
import { UpdateGuestsConnectionDto } from './dto/update-guests-connection.dto';
import { v4 as uuidv4 } from 'uuid';
import { Guest } from './guests-connection.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { GuestsConnection } from './entities/guests-connection.entity';
import { Repository } from 'typeorm';
import { AgentsConnectionService } from 'src/modules/agents-connection/agents-connection.service';
import { AgentsConnectionGateway } from 'src/modules/agents-connection/agents-connection.gateway';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Room } from 'src/modules/agents-connection/agents-connection.interface';

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
      
      for (const room of this.agentsConnectionService.rooms) {
        if(room.available) {
          const guest = this.removeGuestFromPriorityLine(0);
          if (!guest) break;
          room.users.push(guest);
          room.available = false;
          this.agentsConnectionGateway.guestInRoom(room, guest);
        }
      }

      this.agentsConnectionService.updateRoomsList(this.agentsConnectionService.rooms);
    }, 3000);
  }

  pushToPriorityLine(guest: Guest) {
    this.priorityLine$.pipe(take(1)).subscribe(val => {
      const newArr = [...val, guest];
      this._priorityLine.next(newArr);
    })
  }

  create(createGuestsConnectionDto: CreateGuestsConnectionDto) {
    return this.guestConnectionRepository.save(createGuestsConnectionDto); 
  }

  removeGuestFromPriorityLine(idx: number) {
    const priorityLine = this.priorityLine;
    const removedGuest = priorityLine.splice(idx, 1)[0];
    this._priorityLine.next(priorityLine);
    return removedGuest;
  }

  getGuestIdxBySocketId(socketId: string) {
    return this.priorityLine.findIndex((guest) => guest.socketId === socketId );
  }

  getGuestBySocketId(socketId: string) {
    return this.priorityLine.find((guest) => guest.socketId === socketId);
  }
  
  // TODO: Manage priority rules
  addGuestToPriorityLine(guest: Guest): any {
    this.pushToPriorityLine(guest);
  }

  getRoomByGuestSocket(socketId: string) {
    const room = this.agentsConnectionService.rooms.find(room => room.users.find(user => user.socketId === socketId));
    return room;
  }
  
  updateRoomGuest(room: Room) {
    if (!room) return;
  
    room.users = [];
    room.available = true;
  
    this.agentsConnectionService.updateRoom(room.name, room);
  }

  public get priorityLine() : Guest[] {
    return this._priorityLine.value;
  }
  
}
