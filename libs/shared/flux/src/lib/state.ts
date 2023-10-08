import { injectable } from 'inversify';
import { BehaviorSubject, map, Observable } from 'rxjs';

type StateProps = {
    [key: string]: unknown;
};

@injectable()
class State<T extends StateProps> {
    #props$: BehaviorSubject<T>;

    constructor(defaultState: T) {
        this.#props$ = new BehaviorSubject<T>(defaultState);
        const propsNames = Object.keys(defaultState);

        propsNames.forEach((propName) => {
            this._definePropGetter(propName);
            this._definePropObservableGetter(propName);
        });
    }

    protected _setPartialState(partialState: Partial<T>): void {
        this.#props$.next({ ...this.#props$.getValue(), ...partialState });
    }

    private _definePropGetter(prop: string): void {
        Object.defineProperty(this, prop, {
            get: () => this.#props$.getValue()[prop],
        });
    }

    private _definePropObservableGetter(prop: string): void {
        Object.defineProperty(this, `${prop}$`, {
            get: () => this.#props$.asObservable().pipe(map((state) => state[prop])),
        });
    }
}

type ObservableProps<T extends StateProps> = {
    [K in keyof T as `${string & K}$`]: Observable<T[K]>;
};

const TypedStated = State as new <T extends StateProps>(defaultState: T) => T & ObservableProps<T> & State<T>;

export { TypedStated as State };
