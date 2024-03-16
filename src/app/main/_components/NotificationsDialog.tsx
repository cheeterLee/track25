import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from '@/components/ui/dialog';
import { db } from '@/db';
import { invitation, user } from '@/db/schema';
import { validateRequest } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';
import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { redirect } from 'next/navigation';
import AcceptButton from './AcceptButton';
import RejectButton from './RejectButton';

export default async function NotificationsDialog() {
    const { user: authUser } = await validateRequest();
    if (!authUser) {
        redirect('/');
    }

    const data = await db
        .select()
        .from(invitation)
        .innerJoin(user, eq(invitation.senderId, user.id))
        .where(
            and(
                eq(invitation.receiverId, authUser.id),
                eq(invitation.status, 'pending'),
            ),
        );

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='relative' size='icon' variant='outline'>
                    {data.length > 0 && (
                        <div className='absolute right-[-2px] top-[-2px] flex h-4 w-4 items-center justify-center rounded-full bg-red-400'>
                            <div className='text-[9px] text-slate-300'>
                                {data.length}
                            </div>
                        </div>
                    )}
                    <Bell width={15} height={15} />
                </Button>
            </DialogTrigger>
            <DialogContent className='flex min-h-[60vw] min-w-[80vw] flex-col sm:min-h-[600px] sm:min-w-[800px]'>
                <DialogHeader>Notifications</DialogHeader>
                <div className='flex max-h-[50vh] flex-col items-center gap-2 overflow-y-scroll'>
                    {data.map(({ user, invitation }) => (
                        <Card
                            key={invitation.id}
                            className='flex min-h-[60px] w-full items-center justify-between px-2'
                        >
                            <div className='flex items-center gap-2'>
                                <Avatar className='hidden sm:block'>
                                    <AvatarImage src='https://github.com/shadcn.png' />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className='sm:text-md text-xs'>
                                    <span className='font-semibold'>
                                        {user.username}
                                    </span>{' '}
                                    sent you a{' '}
                                    <span className='font-semibold'>
                                        {invitation.type === 'friend'
                                            ? 'friend request'
                                            : 'group invitation'}
                                    </span>
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <AcceptButton
                                    type={invitation.type!}
                                    invitationId={invitation.id}
                                />
                                <RejectButton
                                    invitationId={invitation.id}
                                />
                            </div>
                        </Card>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
