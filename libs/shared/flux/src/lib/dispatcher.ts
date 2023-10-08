import { Class } from '@webrtc-streaming/shared/types';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { filter, Observable, Subject } from 'rxjs';

export class DispatcherAction {
    constructor(public readonly payload?: Record<string, unknown>) {}

    isEqual(eventType: any): boolean {
        return this instanceof eventType;
    }
}

@injectable()
export class Dispatcher {
    readonly #bus = new Subject<DispatcherAction>();

    emit(action: DispatcherAction) {
        this.#bus.next(action);
    }

    on<T extends DispatcherAction>(action: Class<T>): Observable<T> {
        return this.#bus.pipe(filter(dispatcherAction => dispatcherAction.isEqual(action))) as Observable<T>;
    }
}
