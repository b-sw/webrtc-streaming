import { Module } from './di-module.decorator';

describe('@Module', () => {
    it.each([
        {},
        { imports: [] },
        { providers: [] },
        {
            imports: [],
            providers: [],
        },
    ])('creates di module with config', (moduleConfig) => {
        expect(() => {
            @Module(moduleConfig)
            class TestModule {}
        }).not.toThrow();
    });

    it('creates nested di module', () => {
        expect(() => {
            @Module({
                imports: [],
                providers: [],
            })
            class TestModule {}

            @Module({
                imports: [TestModule],
                providers: [],
            })
            class NestedModule {}
        }).not.toThrow();
    });
});
