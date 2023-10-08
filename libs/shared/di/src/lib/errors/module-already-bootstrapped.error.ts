export class ModuleAlreadyBootstrappedError extends Error {
    constructor() {
        super(`Module is already bootstrapped`);
    }
}
