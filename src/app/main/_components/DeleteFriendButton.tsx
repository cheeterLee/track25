'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { deleteFriend } from '@/actions/friendActions';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';

export default function DeleteFriendButton({ friendId }: { friendId: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleClick = async () => {
        setIsLoading(true);
        const { success } = await deleteFriend(friendId);
        if (success) {
            toast({
                title: 'Successfully deleted',
            });
        }
        startTransition(() => {
            router.refresh();
        });
        setIsLoading(false);
    };

    return (
        <Button disabled={isLoading} onClick={handleClick} variant='outline'>
            Delete
        </Button>
    );
}
