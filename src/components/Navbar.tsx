import ThemeToggle from './ThemeToggle';
import LogoWrapper from './LogoWrapper';
import { Button } from '@/components/ui/button';
import AuthForm from './AuthForm';
import { logout } from '@/lib/authActions';
import { validateRequest } from '@/lib/auth';
import { User, Menu } from 'lucide-react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import AuthModal from './AuthModal';
import Link from 'next/link';

export default async function Navbar() {
    const { user } = await validateRequest();

    return (
        <div className='flex h-[100px] w-full items-center justify-between border-b-[1px] border-slate-400 px-1 shadow-sm dark:border-slate-300 md:px-6 lg:px-40'>
            <LogoWrapper width={300} height={200} />
            <Drawer>
                <DrawerTrigger>
                    <Button
                        size='icon'
                        variant='outline'
                        className='block flex h-8 w-8 items-center justify-center p-2 md:hidden'
                        // asChild to prevent hydration error caused by nested button tags
                        asChild
                    >
                        <Menu />
                    </Button>
                </DrawerTrigger>
                <DrawerContent className='h-[80vh]'>
                    <DrawerHeader>
                        <DrawerTitle>Menu</DrawerTitle>
                    </DrawerHeader>
                    {!user ? (
                        <div className='flex items-center justify-center'>
                            <AuthModal />
                        </div>
                    ) : (
                        <div className='flex flex-col items-center gap-10'>
                            <div className='flex items-center gap-3'>
                                <User />
                                <span className='text-md'>{user.username}</span>
                            </div>
                            <Button variant='outline'>
                                <Link href='/main'>Main App</Link>
                            </Button>
                            <DrawerClose>
                                <AuthForm action={logout}>
                                    <Button variant='outline'>Logout</Button>
                                </AuthForm>
                            </DrawerClose>
                        </div>
                    )}
                    <div className='mt-10 flex flex-col justify-center gap-10'>
                        <div className='flex h-full w-full items-center justify-center gap-3'>
                            <span>theme: </span>
                            <ThemeToggle />
                        </div>
                        <DrawerClose>
                            <Button className='mt-60'>close</Button>
                        </DrawerClose>
                    </div>
                </DrawerContent>
            </Drawer>

            <div className='hidden items-center gap-2 md:block md:flex'>
                {!user ? (
                    <AuthModal />
                ) : (
                    <div className='flex items-center gap-6'>
                        <div className='flex items-center gap-1'>
                            <User />
                            <span className='text-sm'>{user.username}</span>
                        </div>
                        <Button variant='outline'>
                            <Link href='/main'>Main App</Link>
                        </Button>
                        <AuthForm action={logout}>
                            <Button variant='outline'>Logout</Button>
                        </AuthForm>
                    </div>
                )}
                <ThemeToggle />
            </div>
        </div>
    );
}
