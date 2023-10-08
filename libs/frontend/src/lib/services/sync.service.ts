import { SocketMessage, SocketPayloads } from '@webrtc-streaming/shared/types';
import { io, Socket } from 'socket.io-client';

export class SyncService {
    private static readonly BASE_URL = 'http://localhost:80';
    #socket: Socket = io();

    constructor() {
        this.#socket = io(SyncService.BASE_URL, {
            transports: ['websocket'],
        });
    }

    get userId(): string {
        return this.#socket.id;
    }

    sendMessage<T extends SocketMessage>(type: T, payload: SocketPayloads[T]): void {
        this.#socket.emit(type, payload);
    }

    addListener<T extends SocketMessage>(type: T, listenerCallback: (payload: SocketPayloads[T]) => void): void {
        this.#socket.on(type, listenerCallback as any);
    }
}

export const syncService = new SyncService();
