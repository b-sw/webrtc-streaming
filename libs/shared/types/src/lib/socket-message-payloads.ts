import { SocketMessage } from './socket-message';

export type RequestCallPayload = {
    offer: any;
    fromUserId: string;
    toUserId: string;
};

export type AcceptCallPayload = {
    answer: any;
    fromUserId: string;
    toUserId: string;
};

export type SocketPayloads = {
    [SocketMessage.AcceptCall]: AcceptCallPayload;
    [SocketMessage.RequestCall]: RequestCallPayload;
    [SocketMessage.JoinRoom]: {};
    [SocketMessage.UsersIds]: { usersIds: string[] };
    [SocketMessage.UserDisconnected]: { userId: string };
};
