import MapWrapper from './_components/MapWrapper';

export default function MainScreenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='flex min-h-screen w-screen'>
            {children}
            <MapWrapper />
        </div>
    );
}
