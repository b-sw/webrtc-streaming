import { DispatcherAction } from '@webrtc-streaming/shared/flux';

export class SetUsersAction extends DispatcherAction {
    constructor(public override readonly payload: { newUsers: string[] }) {
        super(payload);
    }
}
