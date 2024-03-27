import { Bell, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import LogoWrapper from '@/components/LogoWrapper';
import { Upload } from 'lucide-react';
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
import BottomBar from './Bottombar';
import FriendsDialog from './FriendsDialog';
import NotificationsDialog from './NotificationsDialog';
import { db } from '@/db';
import TrackDataSwitcher from './TrackDataSwitcher';

export default async function Sidebar({
    myTrackData,
    user,
}: {
    myTrackData: Track[];
    user: User;
}) {
    const allTrackData = await db.query.access.findMany({
        where: (access, { eq }) => eq(access.userId, user.id),
        with: {
            accessList: {
                with: {
                    accessToTrack: {
                        with: {
                            owner: {
                                columns: {
                                    username: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    return (
        <div className='flex min-h-screen w-screen flex-col sm:w-[430px]'>
            <div className='mx-2 flex h-[60px] max-w-full items-center justify-between'>
                <Button variant='outline' size='icon'>
                    <Link href='/'>
                        <Home className='h-4 w-4' />
                    </Link>
                </Button>
                <div className='flex items-center gap-2'>
                    <FriendsDialog />
                    <NotificationsDialog />
                    <ThemeToggle />
                </div>
            </div>
            <div className='flex max-h-[170px] max-w-full flex-col items-center justify-center'>
                <LogoWrapper width={400} height={250} />
            </div>

            <Tabs defaultValue='my' className='flex max-w-full flex-1 flex-col'>
                <div className='flex max-h-[80px] max-w-full items-center justify-between border-b-[1px] border-slate-400 px-2 pb-1 shadow-sm dark:border-slate-300'>
                    {/* <TabsList className='gap-1'>
                        <TabsTrigger value='my'>My tracks</TabsTrigger>
                        <TabsTrigger value='all'>All tracks</TabsTrigger>
                    </TabsList> */}
                    <TrackDataSwitcher />
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
                    <TabsContent value='all' className='flex flex-col px-2'>
                        {allTrackData.length === 0 ? (
                            <div className='flex h-full w-full items-center justify-center'>
                                You don&apos;t have any track yet :(
                            </div>
                        ) : (
                            allTrackData.map((d) => (
                                <div
                                    key={d.id}
                                    className='h-[100px] w-full px-2 py-1'
                                >
                                    <Card className='flex h-full items-center justify-between px-2'>
                                        <div className='flex flex-col gap-2'>
                                            <div>
                                                {
                                                    d.accessList.accessToTrack
                                                        .slug
                                                }{' '}
                                                <span className='text-sm font-semibold text-purple-400'>
                                                    by:{' '}
                                                    {
                                                        d.accessList
                                                            .accessToTrack.owner
                                                            .username
                                                    }
                                                </span>
                                            </div>
                                            <div className='flex items-center gap-2 text-sm'>
                                                <div className='flex items-center gap-1'>
                                                    <div className='h-[5px] w-[5px] rounded-full bg-orange-300'></div>
                                                    <div>
                                                        elevation:{' '}
                                                        {
                                                            d.accessList
                                                                .accessToTrack
                                                                .elevation
                                                        }
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    <div className='h-[5px] w-[5px] rounded-full bg-teal-500'></div>
                                                    <div>
                                                        distance:{' '}
                                                        {
                                                            d.accessList
                                                                .accessToTrack
                                                                .distance
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <ToDetailButton
                                            slug={
                                                d.accessList.accessToTrack.slug
                                            }
                                        />
                                    </Card>
                                </div>
                            ))
                        )}
                    </TabsContent>
                </div>
            </Tabs>
            <BottomBar user={user} />
        </div>
    );
}
