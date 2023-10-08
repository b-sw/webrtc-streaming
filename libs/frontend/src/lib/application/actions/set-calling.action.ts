import { DispatcherAction } from '@webrtc-streaming/shared/flux';

export class SetCallingAction extends DispatcherAction {
    constructor(public override readonly payload: { isCalling: boolean }) {
        super(payload);
    }
}
