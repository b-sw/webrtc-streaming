import { ChakraProvider } from '@chakra-ui/react';
import { MainDashboard, theme } from '@webrtc-streaming/frontend';

export const App = () => {
    return (
        <ChakraProvider theme={theme}>
            <MainDashboard />
        </ChakraProvider>
    );
};
