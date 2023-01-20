export interface User {
  uuid: string
  userName?: string
  socketId: string
}

export interface Room {
  name: string
  host: User
  users: User[]
}

export interface Guest {
  socketId: string
  roomId?: string
  priority: string
  [key: string]: any
}

export interface PriorityLine {
  [key: string]: Guest
}
