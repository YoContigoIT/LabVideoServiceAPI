import { Guest as GuestUser } from "src/guests/entities/guest.entity"

export interface Guest {
    socketId: string
    roomId?: string
    priority: string
    queueAt: Date
    guest: GuestUser
    [key: string]: any
}

export interface PriorityLine {
    [key: string]: Guest
  }
