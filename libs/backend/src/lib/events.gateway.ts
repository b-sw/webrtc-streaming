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
import { Server, Socket } from 'socket.io';

@WebSocketGateway(EventsGateway.PORT)
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private static readonly PORT = 80;

    // @ts-ignore
    #server: Server;
    #logger: Logger = new Logger('EventsGateway');
    #userIds = new Set<string>();

    @SubscribeMessage('myMessage')
    handlePlayerMove(@ConnectedSocket() client: Socket, @MessageBody() payload: Record<string, any>): void {
        this.#logger.log(`Client sent message. Id: ${client.id} payload: ${payload}`);
    }

    afterInit(server: Server): void {
        this.#server = server;
        this.#logger.log('init');
    }

    handleConnection(client: Socket, ...args: any[]): any {
        this.#logger.log(`Client connected. Id: ${client.id} args: ${args}`);
        this.#userIds.add(client.id);
    }

    handleDisconnect(client: Socket): any {
        this.#logger.log(`Client disconnected. Id: ${client.id}`);
        this.#userIds.delete(client.id);
    }
}
