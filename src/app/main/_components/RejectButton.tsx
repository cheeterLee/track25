'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { rejectRequest } from '@/lib/friendActions';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';

export default function RejectButton({
    invitationId,
}: {
    invitationId: string;
}) {
    const router = useRouter();
    const handleOnClick = async () => {
        const { success, error } = await rejectRequest(invitationId);
        if (success) {
            toast({
                title: 'You have rejected the request',
            });
        }
        startTransition(() => {
            router.refresh();
        });
    };

    return (
        <Button
            onClick={handleOnClick}
            variant='outline'
            className='sm:text-md text-xs'
        >
            Rejected
        </Button>
    );
}
