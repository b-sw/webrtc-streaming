import { Module } from '@webrtc-streaming/shared/di';
import { FluxModule } from '@webrtc-streaming/shared/flux';
import { InfrastructureModule } from '../infrastructure';
import { CallUserActionCreator, ListenSocketEventsActionCreator } from './action-creators';
import { CallState } from './states';

@Module({
    imports: [InfrastructureModule, FluxModule],
    providers: [
        // states
        CallState,

        // action creators
        CallUserActionCreator,
        ListenSocketEventsActionCreator,
    ],
})
export class ApplicationModule {}
