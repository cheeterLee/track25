'use client';

import { Button } from '@/components/ui/button';
import { addDownloadLog } from '@/lib/logActions';
import { Track } from '@/lib/type';
import { Download } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';

export default function DownloadButton({
    track,
}: {
    track: Track | undefined;
}) {
    const router = useRouter();

    const handleClick = async () => {
        const { success, error } = await addDownloadLog(
            track?.id,
            track?.downloadTimes,
        );

        if (success) {
            startTransition(() => {
                router.refresh();
            });
        }
    };

    return (
        <Button
            onClick={handleClick}
            variant='secondary'
            className='flex items-center gap-1'
        >
            <Download width={15} height={15} />
            <Link href={track?.downloadUrl ?? ''}>Download</Link>
        </Button>
    );
}
