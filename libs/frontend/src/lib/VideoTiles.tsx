/// <reference types="webrtc" />
import { Flex, Spacer } from '@chakra-ui/react';
import { useTheme } from './hooks/useTheme';

type Props = {
    peerConnection: RTCPeerConnection;
};

export const VideoTiles = ({ peerConnection }: Props) => {
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
                <video autoPlay muted className="local-video" id="local-video"></video>
                <video autoPlay muted className="remote-video" id="remote-video"></video>
                <Spacer />
            </Flex>

            <Spacer />
        </Flex>
    );
};
