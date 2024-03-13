import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, Share } from 'lucide-react';
import ToGeneralButton from '../_components/ToGeneralButton';
import Link from 'next/link';
import { db } from '@/db';
import { Track } from '@/lib/type';
import { Card } from '@/components/ui/card';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function TrackDetail({
    params,
}: {
    params: { slug: string };
}) {
    const { user } = await validateRequest();
    if (!user) {
        redirect('/');
    }

    const track: Track | undefined = await db.query.track.findFirst({
        where: (track, { eq }) => eq(track.slug, params.slug),
    });

    return (
        <div className='flex min-h-screen w-screen flex-col sm:w-[430px]'>
            <div className='flex h-[55px] w-full items-center justify-between border-b-[1px] border-slate-400 px-1 dark:border-slate-300'>
                <ToGeneralButton />
                <div className='flex items-center gap-2'>
                    <Button
                        variant='outline'
                        className='flex items-center gap-1'
                    >
                        <Share width={15} height={15} />
                        Share
                    </Button>
                    <Button
                        variant='secondary'
                        className='flex items-center gap-1'
                    >
                        <Download width={15} height={15} />
                        <Link href={track?.downloadUrl ?? ''}>Download</Link>
                    </Button>
                </div>
            </div>
            <div className='flex h-[200px] w-full flex-col items-center justify-center'>
                <div className='text-2xl'>{params.slug}</div>
                <div className='mt-2'>
                    Submitted by: <span>{user.username}</span>
                </div>
            </div>
            <div className='grid w-full grid-cols-2 gap-1 px-2'>
                <Card className='flex h-[110px] flex-col items-center justify-center'>
                    <div>Distance</div>
                    <div>{track?.distance ?? 0}</div>
                </Card>
                <Card className='flex h-[110px] flex-col items-center justify-center'>
                    <div>Elevation</div>
                    <div>{track?.elevation ?? 0}</div>
                </Card>
            </div>
        </div>
    );
}
