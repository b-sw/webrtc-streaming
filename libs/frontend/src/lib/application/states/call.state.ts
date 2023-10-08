import { Dispatcher, State } from '@webrtc-streaming/shared/flux';
import { inject, injectable } from 'inversify';
import { SetCallingAction, SetUsersAction } from '../actions';

type CallStateModel = {
    peerConnection: RTCPeerConnection;
    usersIds: string[];
    isCalling: boolean;
};

@injectable()
export class CallState extends State<CallStateModel> {
    static readonly DEFAULT_STATE: CallStateModel = {
        peerConnection: new RTCPeerConnection(),
        usersIds: [],
        isCalling: false,
    };

    constructor(@inject(Dispatcher) private readonly _dispatcher: Dispatcher) {
        super(CallState.DEFAULT_STATE);

        this._dispatcher.on(SetUsersAction).subscribe(action => {
            this._setPartialState({ usersIds: action.payload.newUsers });
        });

        this._dispatcher.on(SetCallingAction).subscribe(action => {
            this._setPartialState({ isCalling: action.payload.isCalling });
        });
    }
}
