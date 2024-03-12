import { validateRequest } from '@/lib/auth';
import MapWrapper from './_components/MapWrapper';
import Sidebar from './_components/Sidebar';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { Track } from '@/lib/type';

export default async function MainScreen() {
    const { user } = await validateRequest();
    if (!user) {
        redirect('/');
    }

    const myTrackData: Track[] = await db.query.track.findMany({
        where: (track, { eq }) => eq(track.userId, user.id),
    });

    console.log('trackData', myTrackData);

    return (
        <div className='flex min-h-screen w-screen'>
            <Sidebar myTrackData={myTrackData} user={user} />
            <MapWrapper />
        </div>
    );
}
