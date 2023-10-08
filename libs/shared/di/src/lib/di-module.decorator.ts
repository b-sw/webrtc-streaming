import { Class } from '@webrtc-streaming/shared/types';
import 'reflect-metadata';
import { InvalidModuleConfigError } from './errors';
import { Provider } from './provider';

export const DI_MODULE_METADATA_KEY = Symbol('DI_MODULE_METADATA_KEY');

export type DIModuleMetadata = {
    imports?: Class<any>[];
    providers?: Provider[];
};

const DIModuleMetadataKeys = {
    IMPORTS: 'imports',
    PROVIDERS: 'providers',
};

const metadataKeys = Object.values(DIModuleMetadataKeys);

function validateModuleKeys(keys: string[]): void {
    keys.forEach(key => {
        if (!metadataKeys.includes(key)) {
            throw new InvalidModuleConfigError(key);
        }
    });
}

export function Module(metadata: DIModuleMetadata): ClassDecorator {
    const propsKeys = Object.keys(metadata);
    validateModuleKeys(propsKeys);

    // eslint-disable-next-line @typescript-eslint/ban-types
    return (target: Function) => {
        Reflect.defineMetadata(DI_MODULE_METADATA_KEY, metadata, target);
    };
}
