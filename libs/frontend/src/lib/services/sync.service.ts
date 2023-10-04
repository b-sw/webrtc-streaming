import { io, Socket } from 'socket.io-client';

export class SyncService {
    private static readonly BASE_URL = 'http://localhost:80';
    #socket: Socket = io();

    constructor() {
        this.#socket = io(SyncService.BASE_URL, {
            transports: ['websocket'],
        });
    }

    sendMessage<T extends string>(type: T, payload: Record<string, any>): void {
        this.#socket.emit(type, payload);
    }

    addMessageListener<T extends string>(type: T, listenerCallback: (payload: Record<string, any>) => void): void {
        this.#socket.on(type, listenerCallback as any);
    }
}

export const syncService = new SyncService();
