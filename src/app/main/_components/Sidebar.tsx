import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import LogoWrapper from '@/components/LogoWrapper';

export default function Sidebar() {
    return (
        <div className='flex min-h-screen w-screen flex-col border-2 border-green-400 sm:w-[430px]'>
            <div className='mx-2 flex h-[60px] max-w-full items-center justify-between'>
                <Button variant='outline' size='icon'>
                    <Link href='/'>
                        <Home className='h-4 w-4' />
                    </Link>
                </Button>
                <div className='flex items-center gap-2'>
                    <Button variant='outline'>Friends</Button>
                    <ThemeToggle />
                </div>
            </div>
            <div className='flex max-h-[170px] max-w-full flex-col items-center justify-center'>
                <LogoWrapper width={400} height={250} />
            </div>
            <div className='h-[80px] max-w-full border-2 border-blue-200'>
                select
            </div>
            <div className='max-w-full flex-1 border-blue-300'>tracks</div>
            <div className='h-[100px] max-w-full border-2 border-blue-200'>
                avatar
            </div>
        </div>
    );
}
