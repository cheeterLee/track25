'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from '@/components/ui/dialog';
import CreateGroupForm from './CreateGroupForm';
import { User } from '@/lib/type';
import { useDialogStore } from '@/providers/DialogStoreProvider';

interface Friend {
    id: string;
    userId: string;
    friendListId: string;
    friendId: string;
    createdAt: Date | null;
    friend: User;
}

export default function CreateGroupDialog({
    friends,
}: {
    friends: Friend[] | undefined;
}) {
    const { createGroupDialogOpen, setCreateGroupDialogOpen } = useDialogStore(
        (state) => state,
    );
    return (
        <Dialog
            open={createGroupDialogOpen}
            onOpenChange={setCreateGroupDialogOpen}
        >
            <DialogTrigger asChild>
                <Button variant='ghost' className='w-full'>
                    <div className='w-full text-left'>Create new group</div>
                </Button>
            </DialogTrigger>
            <DialogContent className='flex max-h-[60vh] min-h-[60vh] min-w-[80vw] flex-col sm:min-h-[600px] sm:min-w-[800px]'>
                <DialogHeader>Create new group</DialogHeader>
                <CreateGroupForm friends={friends} />
            </DialogContent>
        </Dialog>
    );
}
