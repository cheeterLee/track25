'use client';

import { Button } from '@/components/ui/button';
import { retrieveCheckoutSession } from '@/lib/paymentActions';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function PaymentScreen() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('sessionId');
    const mounted = useRef<boolean>(false);

    useEffect(() => {
        if (!sessionId) {
            return;
        }
        if (mounted.current === false) {
            retrieveCheckoutSession(sessionId).then(({ success, error }) => {});
        }
        return () => {
            mounted.current = true;
        };
    }, [sessionId]);

    return (
        <div className='h-screen w-screen border-2 border-pink-200'>
            <Button>
                <Link href='/main'>Back to App</Link>
            </Button>
        </div>
    );
}
