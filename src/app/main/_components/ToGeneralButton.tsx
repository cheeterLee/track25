'use client';

import { Button } from '@/components/ui/button';
import { useTrackStore } from '@/providers/TrackStoreProvider';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ToGeneralButton() {
    const router = useRouter();

    const { setTrackToView } = useTrackStore((state) => state);

    const handleClick = () => {
        setTrackToView('');
        router.push('/main');
    };

    return (
        <Button
            variant='ghost'
            className='flex items-center gap-1'
            onClick={handleClick}
        >
            <ChevronLeft width={15} height={15} />
            Back
        </Button>
    );
}
