import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Room, User as RoomUser } from './agents-connection.interface';
import { CreateAgentsConnectionDto } from './dto/create-agents-connection.dto';
import { AgentsConnection } from './entities/agents-connection.entity';
import { v4 as uuidv4 } from 'uuid';
import { ListAgentsConnectionsDto } from './dto/list-agents-conections.dto';
import { HttpResponse, HttpStatusResponse } from 'src/common/interfaces/http-responses.interface';
import { parseAffeceRowToHttpResponse } from 'src/utilities/functions';
import { BehaviorSubject, Observable, take } from 'rxjs';

@Injectable()
export class AgentsConnectionService {
  rooms: BehaviorSubject<Room[]> = new BehaviorSubject<Room[]>([]);
  rooms$: Observable<Room[]> =  this.rooms.asObservable();

  constructor(
    @InjectRepository(AgentsConnection) private agentsConnectionRepository: Repository<AgentsConnection>,
  ) {}

  agentConnection(createAgentsConnectionDto: CreateAgentsConnectionDto) {
    return this.agentsConnectionRepository.save(createAgentsConnectionDto);
  }

  async addRoom(roomName: string, host: RoomUser): Promise<void> {
    const room = await this.getRoomByName(roomName)
    if (room === -1) {
      this.pushToRoom({ 
        name: roomName,
        host,
        users: [host],
        available: true,
        createdAt: new Date()
      })
    }
  }

  getRoomHost(hostName: string) {
    const roomIndex = this.getRoomByName(hostName)
    return this.rooms.value[roomIndex].host;
  }

  getRoomByName(roomName: string) {
    return this.rooms.value.findIndex((room) => room?.name === roomName)
  }

  addUserToRoom(roomName: any, user: RoomUser) {
    const roomIndex = this.getRoomByName(roomName)
    
    if (roomIndex !== -1) {
      this.rooms[roomIndex].users.push(user)
      const host = this.getRoomHost(roomName)
      if (host.uuid === user.uuid) {
        this.rooms[roomIndex].host.socketId = user.socketId
      }
    } else {
      this.addRoom(roomName, user)
    }
  }

  getRoomByHostSocket(socketId: string) {
    return this.rooms.value.find((room) => room?.host.socketId === socketId);
  }

  removeRoom(roomName: string): Room | HttpResponse {
    const roomIndex = this.getRoomByName(roomName);

    if (roomIndex !== -1) {
      const rooms = this.rooms.value;
      const removedRoom = rooms.splice(roomIndex, 1)[0];
      this.rooms.next(rooms);
      return removedRoom;
    }

    return {
      status: HttpStatusResponse.FAIL,
      message: `The roome name: ${roomName} not exist`
    }
  }

  async getUuidv4(): Promise<any> {
    return uuidv4();
  }

  pushToRoom(room: Room) {
    this.rooms$.pipe(take(1)).subscribe(val => {
      const newArr = [...val, room];
      this.rooms.next(newArr);
    })
  }

  findAll(query: ListAgentsConnectionsDto) {

    const where: FindOptionsWhere<AgentsConnection> = {};

    if (query.uuid) {
      where.user = {
        uuid: query.uuid
      };
    }

    return this.agentsConnectionRepository.find({
      relations: {
        user: true
      },
      where
    });
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
  
}
