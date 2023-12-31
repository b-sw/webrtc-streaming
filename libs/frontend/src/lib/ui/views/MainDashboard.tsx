import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Spacer } from '@chakra-ui/react';
import { useTheme } from '../hooks/useTheme';
import { ActiveUsers } from './ActiveUsers';
import { VideoTiles } from './VideoTiles';

export const MainDashboard = () => {
    const { toggleColorMode, isLightMode } = useTheme();

    return (
        <Flex
            p={5}
            h={'100vh'}
            w={'100vw'}
            direction={['column', 'row']}
            overflow={'hidden'}
            backgroundColor={isLightMode ? 'gray.300' : 'gray.700'}
            position={['relative', 'static']}
        >
            <Flex position={'absolute'}>
                <IconButton
                    icon={isLightMode ? <MoonIcon /> : <SunIcon />}
                    aria-label={'change-color-mode'}
                    rounded={'full'}
                    onClick={toggleColorMode}
                />

                <Spacer />
            </Flex>

            <Flex direction={'column'} w={'100%'} h={'100%'}>
                <Spacer />

                <Flex h={'70%'}>
                    <Spacer />
                    <Flex
                        w={'50%'}
                        h={'100%'}
                        backgroundColor={isLightMode ? 'gray.300' : 'gray.700'}
                        direction={'column'}
                        p={5}
                        gap={5}
                    >
                        <Flex h={'90%'}>
                            <VideoTiles />
                        </Flex>
                        <Flex h={'10%'}>
                            <ActiveUsers />
                        </Flex>
                    </Flex>
                    <Spacer />
                </Flex>

                <Spacer />
            </Flex>
        </Flex>
    );
};
