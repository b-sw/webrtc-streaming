import { Module } from '@webrtc-streaming/shared/di';
import { Dispatcher } from './lib/dispatcher';

@Module({
    providers: [Dispatcher],
})
export class FluxModule {}
