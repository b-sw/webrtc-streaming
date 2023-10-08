import { InjectionToken } from '../injection-token';

export class NoProviderForTokenError extends Error {
    constructor(token: InjectionToken) {
        super(`No provider for token "${token.toString()}"`);
    }
}
