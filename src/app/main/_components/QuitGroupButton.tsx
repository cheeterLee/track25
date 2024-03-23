'use client';

import { Button } from '@/components/ui/button';
import { quitGroup } from '@/lib/friendActions';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';

export default function QuitGroupButton({ groupId }: { groupId: string }) {
    const router = useRouter();

    const handleClick = async () => {
        const success = await quitGroup(groupId);
        if (success) {
            startTransition(() => {
                router.refresh();
            });
        }
    };

    return (
        <Button onClick={handleClick} variant='outline'>
            Quit
        </Button>
    );
}
