'use client';

import { Button } from '@/components/ui/button';
import { Track } from '@/lib/type';
import { Download } from 'lucide-react';
import Link from 'next/link';

export default function DownloadButton({
    track,
}: {
    track: Track | undefined;
}) {
    return (
        <Button variant='secondary' className='flex items-center gap-1'>
            <Download width={15} height={15} />
            <Link href={track?.downloadUrl ?? ''}>Download</Link>
        </Button>
    );
}
