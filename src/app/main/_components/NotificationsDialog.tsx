import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from '@/components/ui/dialog';
import { db } from '@/db';
import { validateRequest } from '@/lib/auth';
import { Bell } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function NotificationsDialog() {
    const { user } = await validateRequest();
    if (!user) {
        redirect('/');
    }

    const notifications = await db.query.invitation.findMany({
        where: (invitation, { eq }) => eq(invitation.receiverId, user.id),
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='relative' size='icon' variant='outline'>
                    {notifications.length > 0 && (
                        <div className='absolute right-[-2px] top-[-2px] flex h-4 w-4 items-center justify-center rounded-full bg-red-400'>
                            <div className='text-[9px] text-slate-300'>
                                {notifications.length}
                            </div>
                        </div>
                    )}
                    <Bell width={15} height={15} />
                </Button>
            </DialogTrigger>
            <DialogContent className='flex min-h-[60vw] min-w-[80vw] flex-col sm:min-h-[600px] sm:min-w-[800px]'>
                <DialogHeader>Notifications</DialogHeader>
                <div>
                    {notifications.map((n) => (
                        <Card key={n.id}>{n.senderId}</Card>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
