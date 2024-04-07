'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { removeUserAccess } from '@/actions/trackAccessActions';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';

export default function RemoveAccessButton({
    trackId,
    userId,
    buttonDisabled,
}: {
    trackId: string | undefined;
    userId: string;
    buttonDisabled: boolean;
}) {
    const router = useRouter();

    const handleClick = async () => {
        const { success } = await removeUserAccess(trackId, userId);
        if (success) {
            toast({
                title: 'Successfully removed access',
            });
            startTransition(() => {
                router.refresh();
            });
        }
    };

    return (
        <Button
            onClick={handleClick}
            variant='outline'
            disabled={buttonDisabled}
        >
            Remove
        </Button>
    );
}
