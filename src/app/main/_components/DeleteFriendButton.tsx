'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { deleteFriend } from '@/lib/friendActions';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';

export default function DeleteFriendButton({ friendId }: { friendId: string }) {
    const router = useRouter();

    const handleClick = async () => {
        const { success } = await deleteFriend(friendId);
        if (success) {
            toast({
                title: 'Successfully deleted',
            });
        }
        startTransition(() => {
            router.refresh();
        });
    };

    return (
        <Button onClick={handleClick} variant='outline'>
            Delete
        </Button>
    );
}
