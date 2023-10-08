import { ChakraProvider } from '@chakra-ui/react';
import { MainDashboard, theme } from '@webrtc-streaming/frontend';
import { DIApplication } from '@webrtc-streaming/shared/di';
import { RootModule } from './root.module';

export const App = () => {
    const application = new DIApplication(RootModule);

    return (
        <ChakraProvider theme={theme}>
            <MainDashboard />
        </ChakraProvider>
    );
};
