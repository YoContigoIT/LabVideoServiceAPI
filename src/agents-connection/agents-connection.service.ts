import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Server } from 'socket.io';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AgentsConnectionController } from './agents-connection.controller';
import { Room, User as RoomUser } from './agents-connection.interface';
import { CreateAgentsConnectionDto } from './dto/create-agents-connection.dto';
import { UpdateAgentsConnectionDto } from './dto/update-agents-connection.dto';
import { AgentsConnection } from './entities/agents-connection.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AgentsConnectionService {
  rooms: Room[] = [];
  constructor(
    @InjectRepository(AgentsConnection) private agentConnectionRepository: Repository<AgentsConnection>
  ) {}

  connection(createAgentsConnectionDto: CreateAgentsConnectionDto) {
    return this.agentConnectionRepository.save(createAgentsConnectionDto);
  }

  async addRoom(roomName: string, host: RoomUser): Promise<void> {
    const room = await this.getRoomByName(roomName)
    if (room === -1) {
      this.rooms.push({ name: roomName, host, users: [host] })
    }
  }

  async getRoomHost(hostName: string): Promise<RoomUser> {
    const roomIndex = await this.getRoomByName(hostName)
    return this.rooms[roomIndex].host;
  }

  async getRoomByName(roomName: string): Promise<number> {
    const roomIndex = this.rooms.findIndex((room) => room?.name === roomName)
    return roomIndex
  }

  async addUserToRoom(roomName: any, user: RoomUser): Promise<void> {
    const roomIndex = await this.getRoomByName(roomName)
    
    if (roomIndex !== -1) {
      this.rooms[roomIndex].users.push(user)
      const host = await this.getRoomHost(roomName)
      if (host.uuid === user.uuid) {
        this.rooms[roomIndex].host.socketId = user.socketId
      }
    } else {
      this.addRoom(roomName, user)
    }

    console.log(JSON.stringify(this.rooms));
  }

  async getUuidv4(): Promise<any> {
    return uuidv4();
  }

  getConnectionAgent() {
    
  }
}
