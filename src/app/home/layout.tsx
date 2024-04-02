import Navbar from '@/components/Navbar';

export default function HomePageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='flex min-h-screen w-screen flex-col'>
            <Navbar />
            {children}
        </div>
    );
}
