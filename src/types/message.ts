import * as SocketIO from 'socket.io-client'

export interface IMessage {
    id: number
    content: string
    createdAt: string
    viewed: boolean
    userId: number
    socket?: SocketIO.Socket
}