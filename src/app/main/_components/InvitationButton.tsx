'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { createInvitation } from '@/actions/friendActions';
import { useState } from 'react';

export default function InvitationButton({
    type,
    receiverId,
    buttonDisabled,
}: {
    type: 'friend' | 'group';
    receiverId: string;
    buttonDisabled: boolean;
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleOnClick = async () => {
        setIsLoading(true);
        const { success, error } = await createInvitation(type, receiverId);
        if (success) {
            toast({
                title: 'Successfully sended',
                duration: 2000,
            });
        } else {
            toast({
                variant: 'destructive',
                description: error,
                duration: 2000,
            });
        }
        setIsLoading(false);
    };

    return (
        <Button
            onClick={handleOnClick}
            variant='secondary'
            disabled={buttonDisabled || isLoading}
        >
            {buttonDisabled ? 'Already Added' : 'Add'}
        </Button>
    );
}
