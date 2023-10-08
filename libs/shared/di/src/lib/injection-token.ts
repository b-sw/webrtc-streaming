import { Class } from '@webrtc-streaming/shared/types';

export type InjectionToken<T = any> = symbol | Class<T>;
