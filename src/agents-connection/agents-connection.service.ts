import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { UpdateAgentsConnectionDto } from './dto/update-agents-connection.dto';

@Injectable()
export class AgentsConnectionService {
  socketIo = new Server;
  constructor() {}

  connection(uuid: string) {
    // this.socketIo.emit
    const socketIo = this.socketIo.on("connection", (socket) => {
      socket.send(JSON.stringify({
        type: 'sdfasdfads',
        content: [ 1, '2' ],
      }));
      console.log(socket);
    });

    console.log(socketIo);
    
    // return 'This action adds a new agentsConnection';
  }

  findAll() {
    return `This action returns all agentsConnection`;
  }

  findOne(id: number) {
    return `This action returns a #${id} agentsConnection`;
  }

  update(id: number, updateAgentsConnectionDto: UpdateAgentsConnectionDto) {
    return `This action updates a #${id} agentsConnection`;
  }

  remove(id: number) {
    return `This action removes a #${id} agentsConnection`;
  }
}
