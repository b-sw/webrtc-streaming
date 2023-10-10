import { act, renderHook } from '@testing-library/react';
import { State } from '@webrtc-streaming/shared/flux';
import { useStateQuery } from './useStateQuery';

type TestStateModel = {
    foo: string;
};

describe('useQuery', () => {
    class TestState extends State<TestStateModel> {
        private static readonly DEFAULT_STATE: TestStateModel = { foo: 'foo' };

        constructor() {
            super(TestState.DEFAULT_STATE);
        }
    }

    let testState: TestState;

    beforeEach(() => {
        testState = new TestState();
    });

    it('has initial value', () => {
        const { result } = renderHook(() => useStateQuery(testState.foo$));

        expect(result.current).toEqual('foo');
    });

    it('is reactive', () => {
        const { result } = renderHook(() => useStateQuery(testState.foo$));

        act(() => {
            testState.foo = 'newFoo';
        });

        expect(result.current).toEqual('newFoo');
    });
});
