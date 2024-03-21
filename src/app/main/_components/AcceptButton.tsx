'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { acceptFriendRequest } from '@/lib/friendActions';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';

export default function AcceptButton({
    type,
    invitationId,
    senderId,
}: {
    type: 'friend' | 'group';
    invitationId: string;
    senderId: string;
}) {
    const router = useRouter();

    const handleOnClick = async () => {
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
        }
    };

    return (
        <Button
            onClick={handleOnClick}
            variant='outline'
            className='sm:text-md text-xs'
        >
            Accepted
        </Button>
    );
}
