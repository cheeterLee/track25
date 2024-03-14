'use client';

import { Button } from '@/components/ui/button';
import { retrieveCheckoutSession } from '@/lib/paymentActions';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function Hero() {
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
        <div className='flex h-screen w-screen items-center justify-center'>
            <Button>
                <Link href='/main'>Back to App</Link>
            </Button>
        </div>
    );
}
