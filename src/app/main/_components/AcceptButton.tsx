'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
    acceptFriendRequest,
    acceptGroupInvitation,
} from '@/actions/friendActions';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';

export default function AcceptButton({
    type,
    invitationId,
    senderId,
    groupId,
}: {
    type: 'friend' | 'group';
    invitationId: string;
    senderId: string;
    groupId: string | null;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleOnClick = async () => {
        setIsLoading(true);
        if (type === 'friend') {
            const { success } = await acceptFriendRequest(
                invitationId,
                senderId,
            );
            if (success) {
                toast({
                    title: 'Successfully added',
                });
            }
            startTransition(() => {
                router.refresh();
            });
        } else if (type === 'group' && groupId !== null) {
            const { success } = await acceptGroupInvitation(
                invitationId,
                groupId,
            );
            if (success) {
                toast({
                    title: 'Successfully added',
                });
            }
            startTransition(() => {
                router.refresh();
            });
        }
        setIsLoading(false);
    };

    return (
        <Button
            onClick={handleOnClick}
            disabled={isLoading}
            variant='outline'
            className='sm:text-md text-xs'
        >
            Accepted
        </Button>
    );
}
