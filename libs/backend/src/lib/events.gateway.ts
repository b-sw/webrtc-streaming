import { Logger } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { AcceptCallPayload, RequestCallPayload, SocketMessage } from '@webrtc-streaming/shared';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(EventsGateway.PORT)
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private static readonly PORT = 80;
    private static readonly ROOM = 'room';

    // @ts-ignore
    #server: Server;
    #logger: Logger = new Logger('EventsGateway');
    #usersIds = new Set<string>();

    @SubscribeMessage(SocketMessage.RequestCall)
    handleRequestCall(@ConnectedSocket() client: Socket, @MessageBody() payload: RequestCallPayload): void {
        this.#logger.log(`Client sent message. Id: ${client.id} ${SocketMessage.RequestCall}`);
        client.to(payload.toUserId).emit(SocketMessage.RequestCall, payload);
    }

    @SubscribeMessage(SocketMessage.AcceptCall)
    handleAcceptCall(@ConnectedSocket() client: Socket, @MessageBody() payload: AcceptCallPayload): void {
        this.#logger.log(`Client sent message. Id: ${client.id} ${SocketMessage.AcceptCall}`);
        client.to(payload.toUserId).emit(SocketMessage.AcceptCall, payload);
    }

    @SubscribeMessage(SocketMessage.JoinRoom)
    handleJoinLobby(@ConnectedSocket() client: Socket, @MessageBody() payload: {}): void {
        this.#logger.log(`Client sent message. Id: ${client.id} ${SocketMessage.JoinRoom}`);
        this.#usersIds.add(client.id);
        client.join(EventsGateway.ROOM);
        this.#server.to(EventsGateway.ROOM).emit(SocketMessage.UsersIds, { usersIds: Array.from(this.#usersIds) });
    }

    afterInit(server: Server): void {
        this.#server = server;
        this.#logger.log('init');
    }

    handleConnection(client: Socket, ...args: any[]): any {
        this.#logger.log(`Client connected. Id: ${client.id} args: ${args}`);
    }

    handleDisconnect(client: Socket): any {
        this.#logger.log(`Client disconnected. Id: ${client.id}`);
        this.#usersIds.delete(client.id);
        this.#server.emit(SocketMessage.UserDisconnected, { userId: client.id });
    }
}
