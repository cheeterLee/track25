import { validateRequest } from '@/lib/auth';
import MapWrapper from './_components/MapWrapper';
import Sidebar from './_components/Sidebar';
import { redirect } from 'next/navigation';

export default async function MainScreen() {
    const { user } = await validateRequest()
    if (!user) {
        redirect('/')
    }

    return (
        <div className='flex min-h-screen w-screen'>
            <Sidebar />
            <MapWrapper />
        </div>
    );
}
