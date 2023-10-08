import { Container, injectable } from 'inversify';
import { DIApplication } from './di-application';
import { Module } from './di-module.decorator';

describe('DIApplication', () => {
    let Application: DIApplication;

    it('creates application with a root module', () => {
        @Module({})
        class RootModule {}

        Application = new DIApplication(RootModule);

        expect(Application.rootContainer).toEqual(expect.any(Container));
    });

    it('creates application with modules tree', () => {
        @injectable()
        class ChildProvider {}

        @Module({
            providers: [ChildProvider],
        })
        class ChildModule {}

        @Module({
            imports: [ChildModule],
        })
        class RootModule {}

        Application = new DIApplication(RootModule);

        expect(() => Application.rootContainer.get(ChildProvider)).not.toThrow();
    });

    it('instantiates new modules for each app', () => {
        @injectable()
        class ChildProvider {}

        @Module({
            providers: [ChildProvider],
        })
        class ChildModule {}

        @Module({
            imports: [ChildModule],
        })
        class RootModule {}

        const ApplicationA = new DIApplication(RootModule);
        const ApplicationB = new DIApplication(RootModule);

        expect(ApplicationA.rootContainer.get(ChildProvider)).not.toBe(ApplicationB.rootContainer.get(ChildProvider));
    });
});
