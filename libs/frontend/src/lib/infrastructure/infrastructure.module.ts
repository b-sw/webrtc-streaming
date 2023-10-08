import { Module } from '@webrtc-streaming/shared/di';
import { SyncService } from './services';

@Module({
    imports: [],
    providers: [SyncService],
})
export class InfrastructureModule {}
