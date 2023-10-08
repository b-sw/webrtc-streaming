import { Container } from 'inversify';
import * as React from 'react';
import { createContext, ReactNode, useContext } from 'react';
import { NoProviderForTokenError } from './errors';
import { InjectionToken } from './injection-token';

const DIContext = createContext<{ container: Container | null }>({ container: null });

type DIProviderProps = {
    container: Container;
    children: ReactNode;
};

export const DIProvider = ({ container, children }: DIProviderProps) => {
    return <DIContext.Provider value={{ container }}>{children}</DIContext.Provider>;
};

export function useInjection<T>(token: InjectionToken<T>) {
    const { container } = useContext(DIContext);

    if (!container) {
        throw new NoProviderForTokenError(token);
    }

    return container.get<T>(token);
}
