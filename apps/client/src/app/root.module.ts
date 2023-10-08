import { Module } from '@webrtc-streaming/shared/di';
import { FluxModule } from '@webrtc-streaming/shared/flux';

@Module({
    imports: [FluxModule],
})
export class RootModule {}
