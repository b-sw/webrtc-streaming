import { Avatar, AvatarBadge, Flex, Spacer } from '@chakra-ui/react';
import { syncService } from '@webrtc-streaming/frontend';
import { AcceptCallPayload, RequestCallPayload, SocketMessage } from '@webrtc-streaming/shared';
import { useEffect, useState } from 'react';
import { BiSolidPhoneCall } from 'react-icons/bi';
import { useTheme } from './hooks/useTheme';

type Props = {
    peerConnection: RTCPeerConnection;
};

export const ActiveUsers = ({ peerConnection }: Props) => {
    const [users, setUsers] = useState<string[]>([]);
    const [isCalling, setIsCalling] = useState(false);

    const { isLightMode } = useTheme();

    useEffect(() => {
        syncService.addListener(SocketMessage.UsersIds, message => {
            setUsers(message.usersIds);
        });
        syncService.addListener(SocketMessage.UserDisconnected, message => {
            setUsers(users.filter(userId => userId !== message.userId));
        });
        syncService.addListener(SocketMessage.AcceptCall, async (message: AcceptCallPayload) => {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));

            if (!isCalling) {
                callUser(message.fromUserId);
                setIsCalling(true);
            }
        });
        syncService.addListener(SocketMessage.RequestCall, async (message: RequestCallPayload) => {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

            syncService.sendMessage(SocketMessage.AcceptCall, {
                answer,
                fromUserId: syncService.userId,
                toUserId: message.fromUserId,
            });
        });
    });

    async function callUser(userId: string) {
        const offer = await peerConnection.createOffer();
        const fromUserId = syncService.userId;

        await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
        syncService.sendMessage(SocketMessage.RequestCall, { offer, fromUserId, toUserId: userId });
    }

    const getUsersAvatars = () => {
        return users.map(userId => {
            return (
                <Avatar
                    key={`avatar-${userId}`}
                    name={userId === syncService.userId ? 'Bartosz' : 'Szymon'}
                    onClick={() => {
                        if (userId !== syncService.userId) {
                            callUser(userId);
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
                {users.length ? (
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
