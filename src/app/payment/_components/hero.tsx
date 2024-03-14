'use client';

import LogoWrapper from '@/components/LogoWrapper';
import { Button } from '@/components/ui/button';
import { retrieveCheckoutSession } from '@/lib/paymentActions';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Hero() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('sessionId');
    const mounted = useRef<boolean>(false);
    const [planType, setPlanType] = useState<string>('');
    const [periodStartTime, setPeriodStartTime] = useState<string>();
    const [periodEndTime, setPeriodEndTime] = useState<string>();

    useEffect(() => {
        if (!sessionId) {
            return;
        }

        if (mounted.current === false) {
            retrieveCheckoutSession(sessionId).then(
                ({ success, type, periodStartTime, periodEndTime }) => {
                    if (type !== undefined) {
                        setPlanType(type);
                    }

                    if (periodStartTime !== undefined) {
                        setPeriodStartTime(periodStartTime);
                    }

                    if (periodEndTime !== undefined) {
                        setPeriodEndTime(periodEndTime);
                    }
                },
            );
        }
        return () => {
            mounted.current = true;
        };
    }, [sessionId]);

    return (
        <div className='flex h-screen w-screen flex-col items-center'>
            <LogoWrapper width={500} height={300} />
            <div className='mt-[-100px] flex flex-col items-center gap-4'>
                <div className='text-md sm:text-xl'>
                    You successfully subscribed a{' '}
                    <span className='font-bold text-orange-300'>
                        {planType}
                    </span>{' '}
                    plan!
                </div>
                <div className='sm:text-md text-xs'>
                    Current period from{' '}
                    <span className='font-bold'>{periodStartTime}</span> to{' '}
                    <span className='font-bold'>{periodEndTime}</span>
                </div>
                <Button className='mt-8 flex items-center gap-1'>
                    <ArrowLeft width={15} hanging={15} />
                    <Link href='/main'>Back to App</Link>
                </Button>
            </div>
        </div>
    );
}
