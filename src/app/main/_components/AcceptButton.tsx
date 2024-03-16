'use client';

import { Button } from '@/components/ui/button';

export default function AcceptButton({
    type,
    invitationId,
}: {
    type: 'friend' | 'group';
    invitationId: string;
}) {
    return (
        <Button variant='outline' className='sm:text-md text-xs'>
            Accepted
        </Button>
    );
}
