import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Room, User as RoomUser } from './agents-connection.interface';
import { CreateAgentsConnectionDto } from './dto/create-agents-connection.dto';
import { AgentsConnection } from './entities/agents-connection.entity';
import { ListAgentsConnectionsDto } from './dto/list-agents-conections.dto';
import { HttpResponse, HttpStatusResponse } from 'src/common/interfaces/http-responses.interface';
import { parseAffeceRowToHttpResponse } from 'src/utilities/helpers';
import { BehaviorSubject, Observable, take } from 'rxjs';

@Injectable()
export class AgentsConnectionService {
  private _rooms: BehaviorSubject<Room[]> = new BehaviorSubject<Room[]>([]);
  rooms$: Observable<Room[]> =  this._rooms.asObservable();

  constructor(
    @InjectRepository(AgentsConnection) private agentsConnectionRepository: Repository<AgentsConnection>,
  ) {}

  public get rooms() : Room[] {
    return this._rooms.value;
  }

  async addRoom(roomName: string, host: RoomUser): Promise<void> {
    const room = this.getRoomByName(roomName)
    if (room === -1) {
      this.pushToRoom({ 
        name: roomName,
        host,
        users: [],
        available: true,
        createdAt: new Date()
      })
    }
  }

  getRoomHost(hostName: string) {
    const roomIndex = this.getRoomByName(hostName)
    return this.rooms[roomIndex].host;
  }

  getRoomByName(roomName: string) {
    return this.rooms.findIndex((room) => room?.name === roomName)
  }

  addUserToRoom(roomName: any, user: RoomUser) {
    const roomIndex = this.getRoomByName(roomName)
    this.addRoom(roomName, user)
  }

  updateSessionIdOnRoom(sessionId: string, roomName: string) {
    const roomIndex = this.getRoomByName(roomName);
    if (roomIndex != -1) {
      this.rooms[roomIndex].sessionId = sessionId;
    }
  }

  updateRoom(roomName: string, room: Room) {
    const idx = this.getRoomByName(roomName);
    if (idx == -1) return;
    
    const rooms = this.rooms;
    rooms[idx] = room;
    this.updateRoomsList(rooms);
  }

  updateRoomsList(rooms : Room[]) {
    this._rooms.next(rooms);
  }

  getRoomByHostSocket(socketId: string) {
    return this.rooms.find((room) => room?.host.socketId === socketId);
  }

  removeRoom(roomName: string): Room | HttpResponse {
    const roomIndex = this.getRoomByName(roomName);

    if (roomIndex !== -1) {
      const rooms = this.rooms;
      const removedRoom = rooms.splice(roomIndex, 1)[0];
      this._rooms.next(rooms);
      return removedRoom;
    }

    return {
      status: HttpStatusResponse.FAIL,
      message: `The roome name: ${roomName} not exist`
    }
  }

  pushToRoom(room: Room) {
    this.rooms$.pipe(take(1)).subscribe(val => {
      const newArr = [...val, room];
      this._rooms.next(newArr);
    })
  }

  async saveAgentDisconnection(id: string) {
    const agentConnectionData = {
      endTimeConnection: new Date()
    }

    const response = await this.agentsConnectionRepository
      .createQueryBuilder()
      .update(AgentsConnection)
      .set(agentConnectionData)
      .where('id = :id', { id })
      .execute();

    return parseAffeceRowToHttpResponse(response.affected);
  }

  getRoomByGuestSocket(socketId: string) {
    return this.rooms.find((room) => room.users.findIndex((user) => user.socketId === socketId) !== -1);
  }

  removeGuestFromRoomBySocket(socketId: string) {
    const room = this.getRoomByGuestSocket(socketId);
    if (!room) return;
    const guestIdx = room.users.findIndex((user) => user.socketId === socketId);

    const removedUser = room.users.splice(guestIdx, 1)[0];
    room.available = true;

    const roomIdx = this.getRoomByName(room.name);

    const rooms = this.rooms;
    rooms[roomIdx] = room;

    this.updateRoomsList(rooms);

    return removedUser;
  }

  // CRUD functions

  agentConnection(createAgentsConnectionDto: CreateAgentsConnectionDto) {
    return this.agentsConnectionRepository.save(createAgentsConnectionDto);
  }


  findAll(query: ListAgentsConnectionsDto) {

    const where: FindOptionsWhere<AgentsConnection> = {};

    if (query.uuid) {
      where.agent = {
        uuid: query.uuid
      };
    }

    return this.agentsConnectionRepository.find({
      relations: {
        agent: true
      },
      where
    });
  }

  // Utilities  
  
}
