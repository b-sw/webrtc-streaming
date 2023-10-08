import { ActionCreator, Dispatcher } from '@webrtc-streaming/shared/flux';
import { SocketMessage } from '@webrtc-streaming/shared/types';
import { inject, injectable } from 'inversify';
import { SyncService } from '../../infrastructure';
import { SetCallingAction } from '../actions';
import { CallState } from '../states';

@injectable()
export class CallUserActionCreator implements ActionCreator {
    constructor(
        @inject(SyncService) private readonly _syncService: SyncService,
        @inject(CallState) private readonly _callState: CallState,
        @inject(Dispatcher) private readonly _dispatcher: Dispatcher,
    ) {}

    create(userId: string): void {
        this._callUser(userId);
    }

    private async _callUser(userId: string): Promise<void> {
        const { peerConnection, isCalling } = this._callState;
        const offer = await peerConnection.createOffer();
        const fromUserId = this._syncService.userId;

        await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
        this._syncService.sendMessage(SocketMessage.RequestCall, { offer, fromUserId, toUserId: userId });
        this._dispatcher.emit(new SetCallingAction({ isCalling: true }));
    }
}
