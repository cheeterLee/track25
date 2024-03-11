import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import LogoWrapper from '@/components/LogoWrapper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Settings, Upload, Contact } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import UploadForm from './UploadForm';

export default function Sidebar() {
    return (
        <div className='flex min-h-screen w-screen flex-col sm:w-[430px]'>
            <div className='mx-2 flex h-[60px] max-w-full items-center justify-between'>
                <Button variant='outline' size='icon'>
                    <Link href='/'>
                        <Home className='h-4 w-4' />
                    </Link>
                </Button>
                <div className='flex items-center gap-2'>
                    <Button
                        variant='outline'
                        className='flex items-center gap-1'
                    >
                        <Contact width={15} height={15} />
                        Friends
                    </Button>
                    <ThemeToggle />
                </div>
            </div>
            <div className='flex max-h-[170px] max-w-full flex-col items-center justify-center'>
                <LogoWrapper width={400} height={250} />
            </div>
            <div className='flex max-h-[80px] max-w-full items-center justify-between border-b-2 border-pink-200 px-2 pb-1'>
                <div className='flex h-full items-center'>
                    <Button variant='ghost'>All tracks</Button>
                    <Button variant='ghost'>My tracks</Button>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant='outline'
                            className='flex items-center gap-1'
                        >
                            <Upload width={15} height={15} />
                            Upload
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload your gpx file</DialogTitle>
                        </DialogHeader>
                        <UploadForm />
                    </DialogContent>
                </Dialog>
            </div>
            <div className='max-w-full flex-1 border-2 border-blue-300'>
                tracks
            </div>
            <div className='flex h-[100px] max-w-full items-center justify-between px-4'>
                <div className='flex items-center gap-4'>
                    <Avatar>
                        <AvatarImage
                            src='https://github.com/shadcn.png'
                            alt='@shadcn'
                        />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col items-center gap-1'>
                        <p>username</p>
                        <Badge variant='secondary'>Free</Badge>
                    </div>
                </div>
                <Button variant='outline' size='icon'>
                    <Settings width={20} height={20} />
                </Button>
            </div>
        </div>
    );
}
