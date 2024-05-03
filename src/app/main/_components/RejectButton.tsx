'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { rejectRequest } from '@/actions/friendActions';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';

export default function RejectButton({
    invitationId,
}: {
    invitationId: string;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleOnClick = async () => {
        setIsLoading(true);
        const { success, error } = await rejectRequest(invitationId);
        if (success) {
            toast({
                title: 'You have rejected the request',
            });
        }
        startTransition(() => {
            router.refresh();
        });
        setIsLoading(false);
    };

    return (
        <Button
            onClick={handleOnClick}
            variant='outline'
            disabled={isLoading}
            className='sm:text-md text-xs'
        >
            Rejected
        </Button>
    );
}
