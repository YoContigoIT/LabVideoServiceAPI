import { Guest } from "src/guests-connection/guests-connection.interface"

export interface User {
  uuid: string
  userName: string
  socketId: string
  agentConnectionId: string;
}

export interface Room {
  name: string
  host: User
  users: (User | Guest) []
  available: boolean
  createdAt: Date
}
