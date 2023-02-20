import { Guest } from "src/modules/guests-connection/guests-connection.interface"

export interface User {
  uuid: string
  userName: string
  socketId: string
  agentConnectionId: string;
}

export interface Room {
  name: string
  host: User
  users: Guest[]
  available: boolean
  createdAt: Date
  sessionId?: string
}
