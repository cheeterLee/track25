import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import LogoWrapper from '@/components/LogoWrapper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Settings, Upload, Contact, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import UploadForm from './UploadForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Track } from '@/lib/type';
import { User } from 'lucia';
import ToDetailButton from './ToDetailButton';

export default function Sidebar({
    myTrackData,
    user,
}: {
    myTrackData: Track[];
    user: User;
}) {
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

            <Tabs defaultValue='my' className='flex max-w-full flex-1 flex-col'>
                <div className='flex max-h-[80px] max-w-full items-center justify-between border-b-[1px] border-slate-400 px-2 pb-1 dark:border-slate-300'>
                    <TabsList className='gap-1'>
                        <TabsTrigger value='my'>My tracks</TabsTrigger>
                        <TabsTrigger value='all'>All tracks</TabsTrigger>
                    </TabsList>
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

                <div className='max-w-full flex-1'>
                    <TabsContent value='my' className='flex flex-col px-2'>
                        {myTrackData.length === 0 ? (
                            <div className='flex h-full w-full items-center justify-center'>
                                You don&apos;t have any track yet :(
                            </div>
                        ) : (
                            myTrackData.map((track) => (
                                <div
                                    key={track.id}
                                    className='h-[100px] w-full px-2 py-1'
                                >
                                    <Card className='flex h-full items-center justify-between px-2'>
                                        <div className='flex flex-col gap-2'>
                                            <div>{track.slug}</div>
                                            <div className='flex items-center gap-2 text-sm'>
                                                <div className='flex items-center gap-1'>
                                                    <div className='h-[5px] w-[5px] rounded-full bg-orange-300'></div>
                                                    <div>
                                                        elevation:{' '}
                                                        {track.elevation}
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    <div className='h-[5px] w-[5px] rounded-full bg-teal-500'></div>
                                                    <div>
                                                        distance:{' '}
                                                        {track.distance}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <ToDetailButton slug={track.slug} />
                                    </Card>
                                </div>
                            ))
                        )}
                    </TabsContent>
                    <TabsContent value='all'>all tracks</TabsContent>
                </div>
            </Tabs>
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
                        <p>{user.username}</p>
                        <Badge variant='secondary'>Free</Badge>
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant='outline' size='icon'>
                            <Settings width={20} height={20} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='flex h-[420px] min-w-[80vw] max-w-[80vw] flex-col justify-start overflow-y-scroll sm:min-w-[800px] sm:max-w-[50vw]'>
                        <DialogHeader>
                            <DialogTitle></DialogTitle>
                        </DialogHeader>
                        <Tabs defaultValue='account' className='h-full w-full'>
                            <TabsList>
                                <TabsTrigger value='profile'>
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger value='subscription'>
                                    Subscription
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent
                                value='profile'
                                className='flex w-full flex-col justify-between gap-6'
                            >
                                <div className='min-h-[250px] border-2 border-pink-200'></div>
                                <div className='flex justify-end'>
                                    <Button variant='destructive'>
                                        Logout
                                    </Button>
                                </div>
                            </TabsContent>
                            <TabsContent
                                value='subscription'
                                className='flex w-full flex-col gap-6'
                            >
                                <div>You are currently on a free plan</div>
                                <div className='grid max-h-full w-full grid-cols-1 gap-1 overflow-y-scroll sm:grid-cols-3'>
                                    <Card className='flex h-[250px] flex-col items-center justify-center'>
                                        <div className='flex flex-col items-center justify-center gap-1'>
                                            <div className='text-2xl'>
                                                Monthly
                                            </div>
                                            <div className='text-sm'>
                                                5&pound; per month
                                            </div>
                                        </div>
                                        <Button
                                            variant='outline'
                                            className='mt-10'
                                        >
                                            Subscribe
                                        </Button>
                                    </Card>
                                    <Card className='flex h-[250px] flex-col items-center justify-center'>
                                        <div className='flex flex-col items-center justify-center gap-1'>
                                            <div className='text-2xl'>
                                                Quarterly
                                            </div>
                                            <div className='text-sm'>
                                                10&pound; per quarter
                                            </div>
                                        </div>
                                        <Button
                                            variant='outline'
                                            className='mt-10'
                                        >
                                            Subscribe
                                        </Button>
                                    </Card>
                                    <Card className='flex h-[250px] flex-col items-center justify-center'>
                                        <div className='flex flex-col items-center justify-center gap-1'>
                                            <div className='text-2xl'>
                                                Yearly
                                            </div>
                                            <div className='text-sm'>
                                                30&pound; per year
                                            </div>
                                        </div>
                                        <Button
                                            variant='outline'
                                            className='mt-10'
                                        >
                                            Subscribe
                                        </Button>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
