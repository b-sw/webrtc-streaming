import { Avatar, AvatarBadge, Flex, Spacer } from '@chakra-ui/react';
import { useInjection } from '@webrtc-streaming/shared/di';
import { SocketMessage } from '@webrtc-streaming/shared/types';
import { useEffect } from 'react';
import { BiSolidPhoneCall } from 'react-icons/bi';
import { CallUserActionCreator, ListenSocketEventsActionCreator } from '../../application/action-creators';
import { CallState } from '../../application/states';
import { SyncService } from '../../infrastructure';
import { useTheme } from '../hooks/useTheme';

export const ActiveUsers = () => {
    const callUserActionCreator = useInjection(CallUserActionCreator);
    const listenSocketEventsActionCreator = useInjection(ListenSocketEventsActionCreator);
    // todo: refactor, don't use infra in view
    const syncService = useInjection(SyncService);
    const { usersIds, isCalling, peerConnection } = useInjection(CallState);
    const { isLightMode } = useTheme();

    useEffect(() => {
        listenSocketEventsActionCreator.create();
    }, []);

    const getUsersAvatars = () => {
        return usersIds.map(userId => {
            return (
                <Avatar
                    key={`avatar-${userId}`}
                    name={userId === syncService.userId ? 'Bartosz' : 'Szymon'}
                    onClick={() => {
                        if (userId !== syncService.userId) {
                            callUserActionCreator.create(userId);
                        }
                    }}
                >
                    <AvatarBadge boxSize="1em" bg="green.500" border={'none'} />
                </Avatar>
            );
        });
    };

    const joinLobby = () => {
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
