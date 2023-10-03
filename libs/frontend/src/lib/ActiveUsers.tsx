import { Flex, Spacer } from '@chakra-ui/react';
import { TbUserCancel } from 'react-icons/tb';
import { useTheme } from './hooks/useTheme';

export const ActiveUsers = () => {
    const { isLightMode } = useTheme();

    return (
        <Flex w={'100%'} backgroundColor={isLightMode ? 'gray.50' : 'gray.500'} rounded={'10'} shadow={'md'}>
            <Spacer />

            <Flex direction={'column'}>
                <Spacer />
                <TbUserCancel size={30} opacity={0.5} />
                <Spacer />
            </Flex>

            <Spacer />
        </Flex>
    );
};
