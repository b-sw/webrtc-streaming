import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainDashboard, theme } from '@webrtc-streaming/frontend';
import { DIApplication, DIProvider } from '@webrtc-streaming/shared/di';
import { RootModule } from './root.module';

export const App = () => {
    const application = new DIApplication(RootModule);
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
                <DIProvider container={application.rootContainer}>
                    <MainDashboard />
                </DIProvider>
            </ChakraProvider>
        </QueryClientProvider>
    );
};
