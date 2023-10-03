/// <reference types="webrtc" />
import { Flex, Spacer } from '@chakra-ui/react';
import { useTheme } from './hooks/useTheme';

export const VideoTiles = () => {
    const { isLightMode } = useTheme();

    navigator.getUserMedia(
        { video: true, audio: true },
        stream => {
            const localVideo = document.getElementById('local-video');
            if (localVideo) {
                (localVideo as HTMLMediaElement).srcObject = stream;
            }
        },
        error => {
            console.warn(error.message);
        },
    );

    return (
        <Flex w={'100%'} rounded={'10'} shadow={'md'} backgroundColor={isLightMode ? 'gray.50' : 'gray.500'}>
            <Spacer />

            <Flex direction={'column'}>
                <Spacer />
                <video autoPlay muted className="local-video" id="local-video"></video>
                <Spacer />
            </Flex>

            <Spacer />
        </Flex>
    );
};
