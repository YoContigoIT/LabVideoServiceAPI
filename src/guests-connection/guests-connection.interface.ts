export interface Guest {
    socketId: string
    roomId?: string
    priority: string
    [key: string]: any
}

export interface PriorityLine {
    [key: string]: Guest
  }
