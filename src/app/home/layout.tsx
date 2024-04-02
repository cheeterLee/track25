import Navbar from '@/components/Navbar';

export default function HomePageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='min-h-screen w-screen'>
            <Navbar />
            {children}
        </div>
    );
}
