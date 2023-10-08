import { useColorMode } from '@chakra-ui/react';

export const useTheme = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const isLightMode = colorMode === 'light';

    return { isLightMode, toggleColorMode };
};
