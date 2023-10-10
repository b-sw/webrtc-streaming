import { State } from '@webrtc-streaming/shared/flux';
import { AcceptCallPayload, RequestCallPayload, SocketMessage } from '@webrtc-streaming/shared/types';
import { inject, injectable } from 'inversify';
import { SyncService } from '../../infrastructure';

type CallStateModel = {
    peerConnection: RTCPeerConnection;
    usersIds: string[];
    currentUserId: string;
    isCalling: boolean;
};

@injectable()
export class CallState extends State<CallStateModel> {
    static readonly DEFAULT_STATE: Omit<CallStateModel, 'currentUserId'> = {
        peerConnection: new RTCPeerConnection(),
        usersIds: [],
        isCalling: false,
    };

    constructor(@inject(SyncService) private readonly _syncService: SyncService) {
        super({ ...CallState.DEFAULT_STATE, currentUserId: _syncService.socketId });

        this._syncService.sendMessage(SocketMessage.JoinRoom, {});
        this._listenSocketEvents();
    }

    public callUser(userId: string): void {
        this._callUser(userId);
    }

    private _listenSocketEvents(): void {
        this._syncService.addListener(SocketMessage.UsersIds, message => {
            this._setPartialState({ usersIds: message.usersIds });
        });

        this._syncService.addListener(SocketMessage.UserDisconnected, message => {
            this._removeDisconnectedUser(message.userId);
        });

        this._syncService.addListener(SocketMessage.AcceptCall, async (message: AcceptCallPayload) => {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
            this._tryCallUser(message.fromUserId);
        });

        this._syncService.addListener(SocketMessage.RequestCall, async (message: RequestCallPayload) => {
            this._acceptCall(message.offer, message.fromUserId);
        });

        this._syncService.onConnect(() => {
            this._setPartialState({ currentUserId: this._syncService.socketId });
        });
    }

    private _removeDisconnectedUser(userId: string): void {
        const newUsers = this.usersIds.filter(id => id !== userId);

        this._setPartialState({ usersIds: newUsers });
    }

    private _tryCallUser(userId: string): void {
        if (!this.isCalling) {
            this._callUser(userId);
        }
    }

    private async _callUser(userId: string): Promise<void> {
        const { peerConnection, isCalling } = this;
        const offer = await peerConnection.createOffer();
        const fromUserId = this._syncService.socketId;

        await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
        this._setPartialState({ isCalling: true });
        this._syncService.sendMessage(SocketMessage.RequestCall, { offer, fromUserId, toUserId: userId });
    }

    private async _acceptCall(offer: RTCSessionDescriptionInit, fromUserId: string): Promise<void> {
        const { peerConnection } = this;
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

        this._syncService.sendMessage(SocketMessage.AcceptCall, {
            answer,
            fromUserId: this._syncService.socketId,
            toUserId: fromUserId,
        });
    }
}
