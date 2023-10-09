import { Avatar, AvatarBadge, Flex, Spacer } from '@chakra-ui/react';
import { useInjection } from '@webrtc-streaming/shared/di';
import { SocketMessage } from '@webrtc-streaming/shared/types';
import { SyncService } from 'libs/frontend/src/lib/infrastructure';
import { BiSolidPhoneCall } from 'react-icons/bi';
import { CallState } from '../../application/states';
import { useTheme } from '../hooks/useTheme';

export const ActiveUsers = () => {
    const callState = useInjection(CallState);
    // todo: refactor, don't use infra in view
    const syncService = useInjection(SyncService);
    const { usersIds, isCalling, peerConnection } = useInjection(CallState);
    const { isLightMode } = useTheme();

    const getUsersAvatars = () => {
        return usersIds.map(userId => {
            return (
                <Avatar
                    key={`avatar-${userId}`}
                    name={userId === callState.currentUserId ? 'Bartosz' : 'Szymon'}
                    onClick={() => {
                        if (userId !== callState.currentUserId) {
                            callState.callUser(userId);
                        }
                    }}
                >
                    <AvatarBadge boxSize="1em" bg="green.500" border={'none'} />
                </Avatar>
            );
        });
    };

    const joinLobby = () => {
        // todo: don't on ui
        syncService.sendMessage(SocketMessage.JoinRoom, {});
    };

    return (
        <Flex w={'100%'} backgroundColor={isLightMode ? 'gray.50' : 'gray.500'} rounded={'10'} shadow={'md'}>
            <Spacer />

            <Flex direction={'column'}>
                <Spacer />
                {usersIds.length ? (
                    <Flex>{getUsersAvatars()}</Flex>
                ) : (
                    <BiSolidPhoneCall size={30} opacity={0.5} onClick={() => joinLobby()} cursor={'pointer'} />
                )}
                <Spacer />
            </Flex>

            <Spacer />
        </Flex>
    );
};
