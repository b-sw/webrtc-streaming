import { Container } from 'inversify';
import 'reflect-metadata';
import { DIApplication } from '../di-application';
import { DIModuleMetadata, Module } from '../di-module.decorator';

export const createTestingModule = (moduleConfig: DIModuleMetadata): Container => {
    @Module(moduleConfig)
    class TestingModule {}

    const application = new DIApplication(TestingModule);

    return application.rootContainer;
};
