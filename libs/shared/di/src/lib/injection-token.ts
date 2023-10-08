import { Class } from './class';

export type InjectionToken<T = any> = symbol | Class<T>;
