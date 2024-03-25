'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { createInvitation } from '@/lib/friendActions';

export default function InvitationButton({
    type,
    receiverId,
    buttonDisabled,
}: {
    type: 'friend' | 'group';
    receiverId: string;
    buttonDisabled: boolean;
}) {
    const handleOnClick = async () => {
        const { success, error } = await createInvitation(type, receiverId);
        if (success) {
            toast({
                title: 'Successfully sended',
            });
        }
    };

    return (
        <Button
            onClick={handleOnClick}
            variant='secondary'
            disabled={buttonDisabled}
        >
            {buttonDisabled ? "Already Added" : "Add"}
        </Button>
    );
}
