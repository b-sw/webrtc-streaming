import { createTestingModule } from '@webrtc-streaming/shared/di';
import { State } from './state';

describe('state', () => {
    type PropsStub = {
        foo: string;
        bar: number;
    };
    const defaultStateStub: PropsStub = {
        foo: 'foo',
        bar: 1,
    };

    let state: any;

    beforeEach(() => {
        const testingModule = createTestingModule({
            providers: [
                {
                    provide: State,
                    useValue: new State<PropsStub>(defaultStateStub),
                },
            ],
        });

        state = testingModule.get(State);
    });

    it('has props', () => {
        expect(state.foo).toEqual(defaultStateStub.foo);
        expect(state.bar).toEqual(defaultStateStub.bar);
    });

    it('has initial observable props', () => {
        const fooSpy = jest.fn();
        const barSpy = jest.fn();

        state.foo$.subscribe(fooSpy);
        state.bar$.subscribe(barSpy);

        expect(fooSpy).toHaveBeenCalledWith(defaultStateStub.foo);
        expect(barSpy).toHaveBeenCalledWith(defaultStateStub.bar);
    });

    it('sets new state', () => {
        const newFoo = 'newFoo';

        state.foo = newFoo;

        expect(state.foo).toEqual(newFoo);
        expect(state.bar).toEqual(defaultStateStub.bar);
    });

    it('observers new state', () => {
        const newFoo = 'newFoo';
        const fooSpy = jest.fn();
        const barSpy = jest.fn();
        state.foo$.subscribe(fooSpy);
        state.bar$.subscribe(barSpy);
        [fooSpy, barSpy].forEach(spy => spy.mockClear());

        state.foo = newFoo;

        expect(fooSpy).toHaveBeenCalledWith(newFoo);
        expect(barSpy).not.toHaveBeenCalled();
    });
});
