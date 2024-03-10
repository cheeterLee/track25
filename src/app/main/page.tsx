import MapWrapper from './_components/MapWrapper';
import Sidebar from './_components/Sidebar';

export default function MainScreen() {
    return (
        <div className='flex min-h-screen w-screen'>
            <Sidebar />
            <MapWrapper />
        </div>
    );
}
