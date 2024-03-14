'use client';

import { Button } from '@/components/ui/button';
import { cancelSubscription } from '@/lib/paymentActions';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';

export default function UnsubscribeButton({
    isPremium,
    userId,
}: {
    isPremium: boolean;
    userId: string;
}) {
    const router = useRouter();

    const handleOnclick = async () => {
        const { success } = await cancelSubscription(userId);
        if (success) {
            startTransition(() => {
                router.refresh();
            });
        }
    };

    return (
        <Button variant='destructive' onClick={handleOnclick}>
            Unsubscribe
        </Button>
    );
}
