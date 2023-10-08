import { Container } from 'inversify';
import { Class } from './class';
import { DIModule } from './di-module';
import { DI_MODULE_METADATA_KEY, DIModuleMetadata } from './di-module.decorator';

export class DIApplication {
    readonly #RootModuleClass: Class<any>;
    readonly #modules = new Map<Class<any>, DIModule>();

    constructor(RootModuleClass: Class<any>) {
        this.#RootModuleClass = RootModuleClass;

        this._createModule(this.#RootModuleClass);
        this.#modules.get(RootModuleClass)!.bootstrap();
    }

    get rootContainer(): Container {
        return this.#modules.get(this.#RootModuleClass)!.container;
    }

    private _createModule(moduleClass: Class<any>): void {
        const moduleConfig = Reflect.getMetadata(DI_MODULE_METADATA_KEY, moduleClass) as DIModuleMetadata;

        moduleConfig.imports?.forEach((importedModuleClass) => this._createModule(importedModuleClass));

        const importedModules =
            moduleConfig.imports?.map((importedModuleClass) => this.#modules.get(importedModuleClass)!) ?? [];

        const module = new DIModule({
            imports: importedModules,
            providers: moduleConfig.providers ?? [],
        });

        this.#modules.set(moduleClass, module);
    }
}
