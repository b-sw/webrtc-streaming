import { ActionCreator, Dispatcher } from '@webrtc-streaming/shared/flux';
import { AcceptCallPayload, RequestCallPayload, SocketMessage } from '@webrtc-streaming/shared/types';
import { inject, injectable } from 'inversify';
import { SyncService } from '../../infrastructure';
import { SetUsersAction } from '../actions';
import { CallState } from '../states';
import { CallUserActionCreator } from './call-user.action-creator';

@injectable()
export class ListenSocketEventsActionCreator implements ActionCreator {
    constructor(
        @inject(SyncService) private readonly _syncService: SyncService,
        @inject(CallState) private readonly _callState: CallState,
        @inject(Dispatcher) private readonly _dispatcher: Dispatcher,
        @inject(CallUserActionCreator) private readonly _callUserActionCreator: CallUserActionCreator,
    ) {}

    create(): void {
        console.log('wtf');
        const { peerConnection, isCalling } = this._callState;

        this._syncService.addListener(SocketMessage.UsersIds, message => {
            this._dispatcher.emit(new SetUsersAction({ newUsers: message.usersIds }));
        });

        this._syncService.addListener(SocketMessage.UserDisconnected, message => {
            const newUsers = this._callState.usersIds.filter(userId => userId !== message.userId);

            this._dispatcher.emit(new SetUsersAction({ newUsers }));
        });

        this._syncService.addListener(SocketMessage.AcceptCall, async (message: AcceptCallPayload) => {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));

            if (!isCalling) {
                this._callUserActionCreator.create(message.fromUserId);
            }
        });

        this._syncService.addListener(SocketMessage.RequestCall, async (message: RequestCallPayload) => {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

            this._syncService.sendMessage(SocketMessage.AcceptCall, {
                answer,
                fromUserId: this._syncService.userId,
                toUserId: message.fromUserId,
            });
        });
    }
}
