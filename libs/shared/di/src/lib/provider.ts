import { Class } from './class';
import { InjectionToken } from './injection-token';

export type ClassProvider<T = any> = { provide: InjectionToken; useClass: Class<T> };

export type ValueProvider<T = any> = { provide: InjectionToken; useValue: T };

export type Provider<T = any> = ClassProvider<T> | ValueProvider<T> | Class<T>;
