import { ApplicationModule } from '@webrtc-streaming/frontend';
import { Module } from '@webrtc-streaming/shared/di';

@Module({
    imports: [ApplicationModule],
})
export class RootModule {}
