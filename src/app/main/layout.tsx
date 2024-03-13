import MapWrapper from './_components/MapWrapper';
import { db } from '@/db';
import { validateRequest } from '@/lib/auth';
import { Track } from '@/lib/type';
import { redirect } from 'next/navigation';

export default async function MainScreenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = await validateRequest();
    if (!user) {
        redirect('/');
    }

    const myTrackData: Track[] = await db.query.track.findMany({
        where: (track, { eq }) => eq(track.userId, user.id),
    });

    return (
        <div className='flex min-h-screen w-screen'>
            {children}
            <MapWrapper myTrackData={myTrackData} />
        </div>
    );
}
