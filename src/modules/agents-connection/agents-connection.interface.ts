import { Guest } from "src/modules/guests-connection/guests-connection.interface"
import { Agent as AgentUser } from "../agent/entities/agent.entity" 

export interface Agent {
  uuid: string
  agent: AgentUser
  socketId: string
  agentConnectionId: string;
}

export interface Room {
  name: string
  host: Agent
  users: Guest[]
  available: boolean
  createdAt: Date
  sessionId?: string
}
