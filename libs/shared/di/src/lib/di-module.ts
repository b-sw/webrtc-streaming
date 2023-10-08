import { Container } from 'inversify';
import { Class } from './class';
import { ModuleAlreadyBootstrappedError } from './errors';
import { ClassProvider, Provider, ValueProvider } from './provider';

type ModuleConfig = {
    imports: DIModule[];
    providers: Provider[];
};

type ModuleProperties = {
    imports: Set<DIModule>;
    providers: Set<Provider>;
};

export class DIModule {
    #container = new Container({ defaultScope: 'Singleton' });
    #config: ModuleProperties;
    #bootstrapped = false;

    constructor({ imports, providers }: ModuleConfig) {
        this.#config = {
            imports: new Set(imports),
            providers: new Set(providers),
        };
    }

    get container() {
        return this.#container;
    }

    static isValueProvider(provider: Provider): provider is ValueProvider {
        return 'useValue' in provider;
    }

    static isClassProvider(provider: Provider): provider is ValueProvider {
        return 'useClass' in provider;
    }

    bootstrap(): void {
        if (this.#bootstrapped) {
            throw new ModuleAlreadyBootstrappedError();
        }

        const moduleProviders = this._getModuleProviders();
        moduleProviders.forEach((provider) => {
            this._bindProviderToContainer(provider);
        });

        this._bootstrap(this.#container);
    }

    private _bootstrap(container: Container): void {
        if (this.#bootstrapped) {
            return;
        }

        this.#container = container;

        const importedModules = this.#config.imports;
        importedModules.forEach((importedModule) => {
            importedModule._bootstrap(container);
        });

        this.#bootstrapped = true;
    }

    private _getModuleProviders(): Set<Provider> {
        const moduleImports = this.#config.imports;
        const moduleProviders = new Set(this.#config.providers);

        moduleImports.forEach((importedModule) => {
            const importedModuleProviders = importedModule._getModuleProviders();

            importedModuleProviders.forEach((provider) => {
                moduleProviders.add(provider);
            });
        });

        return moduleProviders;
    }

    private _bindProviderToContainer(provider: Provider) {
        if (DIModule.isValueProvider(provider)) {
            this.#container.bind(provider.provide).toConstantValue(provider.useValue);
        } else if (DIModule.isClassProvider(provider)) {
            this.#container.bind(provider.provide).to((provider as ClassProvider).useClass);
        } else {
            this.#container.bind(provider as Class<any>).toSelf();
        }
    }
}
