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

    it('creates a state with props', () => {
        expect(state.foo).toEqual(defaultStateStub.foo);
        expect(state.bar).toEqual(defaultStateStub.bar);
    });

    it('creates a state with observable props', () => {
        const fooSpy = jest.fn();
        const barSpy = jest.fn();

        state.foo$.subscribe(fooSpy);
        state.bar$.subscribe(barSpy);

        expect(fooSpy).toHaveBeenCalledWith(defaultStateStub.foo);
        expect(barSpy).toHaveBeenCalledWith(defaultStateStub.bar);
    });
});
