import ThemeToggle from './ThemeToggle';
import LogoWrapper from './LogoWrapper';
import { Button } from '@/components/ui/button';
import AuthForm from './AuthForm';
import { logout } from '@/actions/authActions';
import { validateRequest } from '@/lib/auth';
import { Menu, User } from 'lucide-react';
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
import NavMenu from '@/app/home/_components/NavMenu';
import { Separator } from './ui/separator';

export default async function Navbar() {
    const { user } = await validateRequest();

    return (
        <div className='sticky top-0 flex h-[100px] w-full items-center justify-between border-b-[1px] border-slate-400 px-1 shadow-sm dark:border-slate-500 md:px-6 lg:px-20'>
            <div className='flex items-center'>
                <LogoWrapper width={300} height={200} />
                <NavMenu />
            </div>
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
                        <DrawerTitle className='text-lg'>Menu</DrawerTitle>
                    </DrawerHeader>
                    <Separator />
                    <div className='flex h-full w-full flex-col justify-between'>
                        <div className='flex w-full flex-col'>
                            <Button variant='link' size='lg'>
                                <Link href='/home' className='text-lg'>
                                    Home
                                </Link>
                            </Button>
                            <Separator />
                            <Button variant='link' size='lg'>
                                <Link href='/home/about' className='text-lg'>
                                    About
                                </Link>
                            </Button>
                            <Separator />
                            <Button variant='link' size='lg'>
                                <Link href='/home/pricing' className='text-lg'>
                                    Pricing
                                </Link>
                            </Button>
                            <Separator />
                            <Button variant='link' size='lg'>
                                <Link href='/home/showcase' className='text-lg'>
                                    Showcase
                                </Link>
                            </Button>
                            <Separator />
                        </div>
                        <div className='mb-20 flex items-center justify-center gap-2'>
                            {!user ? (
                                <AuthModal />
                            ) : (
                                <div className='flex items-center gap-2'>
                                    <div className='flex items-center'>
                                        <User />
                                        <span>{user.username}</span>
                                    </div>
                                    <DrawerClose>
                                        <AuthForm action={logout}>
                                            <Button variant='outline'>
                                                Logout
                                            </Button>
                                        </AuthForm>
                                    </DrawerClose>
                                    <Button>
                                        <Link href='/main'>Main App</Link>
                                    </Button>
                                </div>
                            )}
                            <ThemeToggle />
                        </div>
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
                        <AuthForm action={logout}>
                            <Button variant='outline'>Logout</Button>
                        </AuthForm>
                        <Button variant='default'>
                            <Link href='/main'>Main App</Link>
                        </Button>
                    </div>
                )}
                <ThemeToggle />
            </div>
        </div>
    );
}
