import { Module } from '@webrtc-streaming/shared/di';
import { FluxModule } from '@webrtc-streaming/shared/flux';
import { InfrastructureModule } from '../infrastructure';
import { CallState } from './states';

@Module({
    imports: [InfrastructureModule, FluxModule],
    providers: [CallState],
})
export class ApplicationModule {}
