import { Avatar, AvatarBadge, Flex, Spacer } from '@chakra-ui/react';
import { useInjection } from '@webrtc-streaming/shared/di';
import { BiSolidPhoneCall } from 'react-icons/bi';
import { CallState } from '../../application/states';
import { useStateQuery } from '../hooks/useStateQuery';
import { useTheme } from '../hooks/useTheme';

export const ActiveUsers = () => {
    const callState = useInjection(CallState);
    const usersIds = useStateQuery(callState.usersIds$);
    const currentUserId = useStateQuery(callState.currentUserId$);
    const { isLightMode } = useTheme();

    const getUsersAvatars = () => {
        return usersIds?.map(userId => {
            return (
                <Avatar
                    key={`avatar-${userId}`}
                    name={userId === currentUserId ? 'Bartosz' : 'Szymon'}
                    onClick={() => {
                        if (userId !== currentUserId) {
                            callState.callUser(userId);
                        }
                    }}
                >
                    <AvatarBadge boxSize="1em" bg="green.500" border={'none'} />
                </Avatar>
            );
        });
    };

    return (
        <Flex w={'100%'} backgroundColor={isLightMode ? 'gray.50' : 'gray.500'} rounded={'10'} shadow={'md'}>
            <Spacer />

            <Flex direction={'column'}>
                <Spacer />
                {usersIds?.length ? (
                    <Flex>{getUsersAvatars()}</Flex>
                ) : (
                    <BiSolidPhoneCall size={30} opacity={0.5} cursor={'pointer'} />
                )}
                <Spacer />
            </Flex>

            <Spacer />
        </Flex>
    );
};
