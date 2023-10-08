import { injectable } from 'inversify';
import 'reflect-metadata';
import { DIModule } from './di-module';

describe('DIModule', () => {
    it('has provider', () => {
        @injectable()
        class Provider {}

        const Module = new DIModule({
            imports: [],
            providers: [Provider],
        });

        Module.bootstrap();

        expect(Module.container.get(Provider)).toEqual(expect.any(Provider));
    });

    it('bootstraps once', () => {
        @injectable()
        class Provider {}

        const Module = new DIModule({
            imports: [],
            providers: [Provider],
        });

        Module.bootstrap();

        expect(() => Module.bootstrap()).toThrow('Module is already bootstrapped');
    });

    it('injects provider', () => {
        @injectable()
        class Provider {}

        @injectable()
        class Consumer {
            constructor(private readonly provider: Provider) {}
        }

        const Module = new DIModule({
            imports: [],
            providers: [Provider, Consumer],
        });

        Module.bootstrap();

        expect(() => Module.container.get(Consumer)).not.toThrow();
    });

    it('provides from parent to child', () => {
        @injectable()
        class Provider {}

        @injectable()
        class Consumer {
            constructor(private readonly provider: Provider) {}
        }

        const ChildModule = new DIModule({
            imports: [],
            providers: [Consumer],
        });

        const ParentModule = new DIModule({
            imports: [ChildModule],
            providers: [Provider],
        });

        ParentModule.bootstrap();

        expect(() => ChildModule.container.get(Consumer)).not.toThrow();
        expect(() => ParentModule.container.get(Consumer)).not.toThrow();
    });

    it('provider is global', () => {
        @injectable()
        class Provider {}

        @injectable()
        class Consumer {
            constructor(private readonly provider: Provider) {}
        }

        const ChildModuleA = new DIModule({
            imports: [],
            providers: [Provider],
        });

        const ChildModuleB = new DIModule({
            imports: [],
            providers: [Consumer],
        });

        const ParentModule = new DIModule({
            imports: [ChildModuleA],
            providers: [],
        });

        const RootModule = new DIModule({
            imports: [ChildModuleB, ParentModule],
            providers: [],
        });

        RootModule.bootstrap();

        [ChildModuleA, ChildModuleB, ParentModule, RootModule].forEach((module) => {
            expect(() => module.container.get(Provider)).not.toThrow();
            expect(() => module.container.get(Consumer)).not.toThrow();
        });
    });

    it('bootstraps child modules once', () => {
        @injectable()
        class Provider {}

        @injectable()
        class Consumer {
            constructor(private readonly provider: Provider) {}
        }

        const ChildModuleA = new DIModule({
            imports: [],
            providers: [Provider],
        });

        const ParentModule = new DIModule({
            imports: [ChildModuleA],
            providers: [],
        });

        const ChildModuleB = new DIModule({
            imports: [],
            providers: [Consumer],
        });

        const RootModule = new DIModule({
            imports: [ChildModuleB, ParentModule, ChildModuleA],
            providers: [],
        });

        RootModule.bootstrap();

        expect(() => ChildModuleA.container.get(Provider)).not.toThrow();
    });

    it('is singleton by default', () => {
        const constructorSpy = jest.fn();

        @injectable()
        class Provider {}

        @injectable()
        class Consumer {
            constructor(private readonly provider: Provider) {
                constructorSpy();
            }
        }

        const ChildModule = new DIModule({
            imports: [],
            providers: [Consumer],
        });

        const ParentModule = new DIModule({
            imports: [ChildModule],
            providers: [Provider],
        });

        ParentModule.bootstrap();

        expect(() => ChildModule.container.get(Consumer)).not.toThrow();
        expect(() => ChildModule.container.get(Consumer)).not.toThrow();
        expect(() => ParentModule.container.get(Consumer)).not.toThrow();

        expect(constructorSpy).toHaveBeenCalledTimes(1);
    });
});
