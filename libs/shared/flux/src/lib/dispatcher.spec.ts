import 'reflect-metadata';
import { Dispatcher, DispatcherAction } from './dispatcher';

describe('Dispatcher', () => {
    let dispatcher: Dispatcher;

    beforeEach(() => {
        dispatcher = new Dispatcher();
    });

    it('emits action', (done) => {
        class Action extends DispatcherAction {}

        const action = new Action();

        dispatcher.on(Action).subscribe(() => {
            done();
        });

        dispatcher.emit(action);
    });

    it('emits action with payload', (done) => {
        class Action extends DispatcherAction {}

        const payloadStub = { a: 'b' };
        const action = new Action(payloadStub);

        dispatcher.on(Action).subscribe((dispatcherAction) => {
            expect(dispatcherAction).toEqual(new Action(payloadStub));
            done();
        });

        dispatcher.emit(action);
    });

    it('does not receive non-subscribed action', (done) => {
        class ActionA extends DispatcherAction {}

        class ActionB extends DispatcherAction {}

        const action = new ActionA();

        dispatcher.on(ActionB).subscribe(() => {
            done('wrong action received');
        });

        dispatcher.emit(action);
        done();
    });
});
