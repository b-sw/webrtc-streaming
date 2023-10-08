import { render, screen } from '@testing-library/react';
import { Container } from 'inversify';
import * as React from 'react';
import { DIProvider, useInjection } from './use-injection';

describe('useInjection', () => {
    const providerTokenStub = Symbol('tokenStub');
    const providerStub = 'textStub';
    const testId = 'test-element';
    const TestComponent = () => {
        const testProvider = useInjection<string>(providerTokenStub);

        return <div data-testid={testId}>{testProvider}</div>;
    };

    let container: Container;

    beforeEach(() => {
        container = new Container();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('throws error for no provider in context', () => {
        const renderComponent = () =>
            render(
                <DIProvider container={container}>
                    <TestComponent />
                </DIProvider>,
            );

        expect(renderComponent).toThrow();
    });

    it('resolves provider', () => {
        container.bind(providerTokenStub).toConstantValue(providerStub);

        render(
            <DIProvider container={container}>
                <TestComponent />
            </DIProvider>,
        );

        expect(screen.getByTestId(testId).textContent).toEqual(providerStub);
    });
});
