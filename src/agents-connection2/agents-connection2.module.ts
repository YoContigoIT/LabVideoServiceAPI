import { Module } from '@nestjs/common';
import { AgentsConnection2Service } from './agents-connection2.service';
import { AgentsConnection2Gateway } from './agents-connection2.gateway';

@Module({
  providers: [AgentsConnection2Gateway, AgentsConnection2Service]
})
export class AgentsConnection2Module {}
