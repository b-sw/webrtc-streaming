/// <reference types="webrtc" />
import { Flex, Spacer } from '@chakra-ui/react';
import { useInjection } from '@webrtc-streaming/shared/di';
import { CallState } from '../../application/states';
import { useTheme } from '../hooks/useTheme';

export const VideoTiles = () => {
    const { peerConnection } = useInjection(CallState);
    const { isLightMode } = useTheme();

    navigator.getUserMedia(
        { video: true, audio: true },
        stream => {
            const localVideo = document.getElementById('local-video');
            if (localVideo) {
                (localVideo as HTMLMediaElement).srcObject = stream;
            }

            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
        },
        error => {
            console.warn(error.message);
        },
    );

    peerConnection.ontrack = function ({ streams: [stream] }) {
        const remoteVideo = document.getElementById('remote-video');
        if (remoteVideo) {
            (remoteVideo as HTMLMediaElement).srcObject = stream;
        }
    };

    return (
        <Flex w={'100%'} rounded={'10'} shadow={'md'} backgroundColor={isLightMode ? 'gray.50' : 'gray.500'}>
            <Spacer />

            <Flex direction={'column'}>
                <Spacer />
                <Flex border={'1px solid green'}>
                    <video autoPlay muted className="local-video" id="local-video"></video>
                </Flex>
                <Flex border={'1px solid red'}>
                    <video autoPlay muted className="remote-video" id="remote-video"></video>
                </Flex>
                <Spacer />
            </Flex>

            <Spacer />
        </Flex>
    );
};
