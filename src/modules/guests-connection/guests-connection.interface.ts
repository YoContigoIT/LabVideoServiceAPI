import { Guest as GuestUser } from "src/modules/guests/entities/guest.entity"

export interface Guest {
    socketId: string
    roomId?: string
    priority: string
    queueAt: Date
    guestConnectionId: string
    guest: GuestUser
    details?: any
    [key: string]: any
}

export interface PriorityLine {
    [key: string]: Guest
  }
