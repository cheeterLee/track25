import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, Share } from 'lucide-react';
import ToGeneralButton from '../_components/ToGeneralButton';
import Link from 'next/link';
import { db } from '@/db';
import { Track } from '@/lib/type';
import { Card } from '@/components/ui/card';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ShareFriendsForm from '../_components/ShareFriendsForm';

export default async function TrackDetail({
    params,
}: {
    params: { slug: string };
}) {
    const { user } = await validateRequest();
    if (!user) {
        redirect('/');
    }

    const track: Track | undefined = await db.query.track.findFirst({
        where: (track, { eq }) => eq(track.slug, params.slug),
    });

    const userWithAccess = await db.query.accessList.findFirst({
        where: (accessList, { eq }) => eq(accessList.trackId, track?.id!),
        with: {
            access: {
                with: {
                    userWithAccess: {
                        columns: {
                            username: true,
                            id: true,
                        },
                    },
                },
            },
        },
    });

    const friendsData = await db.query.friendList.findFirst({
        where: (friendList, { eq }) => eq(friendList.userId, user.id),
        with: {
            friendship: {
                with: {
                    friend: {
                        columns: {
                            username: true,
                            id: true,
                        },
                    },
                },
            },
        },
    });

    const groupData = await db.query.groupMember.findMany({
        where: (groupMember, { eq }) => eq(groupMember.userId, user.id),
        with: {
            group: {
                with: {
                    groupMembers: {
                        with: {
                            member: {
                                columns: {
                                    username: true,
                                    id: true,
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
            <div className='flex h-[55px] w-full items-center justify-between border-b-[1px] border-slate-400 px-1 dark:border-slate-300'>
                <ToGeneralButton />
                <div className='flex items-center gap-2'>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant='outline'
                                className='flex items-center gap-1'
                            >
                                <Share width={15} height={15} />
                                Share
                            </Button>
                        </DialogTrigger>
                        <DialogContent className='flex min-h-[60vw] min-w-[80vw] flex-col sm:min-h-[600px] sm:min-w-[800px]'>
                            <DialogHeader>
                                Share with friends or group
                            </DialogHeader>
                            <Tabs defaultValue='friends' className='w-full'>
                                <TabsList>
                                    <TabsTrigger value='friends'>
                                        Friends
                                    </TabsTrigger>
                                    <TabsTrigger value='groups'>
                                        Groups
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value='friends'>
                                    <ShareFriendsForm
                                        friends={friendsData?.friendship}
                                        trackId={track?.id}
                                    />
                                </TabsContent>
                                <TabsContent value='groups'>groups</TabsContent>
                            </Tabs>
                        </DialogContent>
                    </Dialog>
                    <Button
                        variant='secondary'
                        className='flex items-center gap-1'
                    >
                        <Download width={15} height={15} />
                        <Link href={track?.downloadUrl ?? ''}>Download</Link>
                    </Button>
                </div>
            </div>
            <div className='flex h-[200px] w-full flex-col items-center justify-center'>
                <div className='text-2xl'>{params.slug}</div>
                <div className='mt-2'>
                    Submitted by: <span>{user.username}</span>
                </div>
            </div>
            <div className='grid w-full grid-cols-2 gap-1 px-2'>
                <Card className='flex h-[110px] flex-col items-center justify-center'>
                    <div>Distance</div>
                    <div>{track?.distance ?? 0}</div>
                </Card>
                <Card className='flex h-[110px] flex-col items-center justify-center'>
                    <div>Elevation</div>
                    <div>{track?.elevation ?? 0}</div>
                </Card>
            </div>
        </div>
    );
}
