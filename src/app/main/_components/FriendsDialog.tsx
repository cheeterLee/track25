import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Contact, Plus } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SearchForm from './SearchForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/db';
import { groupMember, user } from '@/db/schema';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DeleteFriendButton from './DeleteFriendButton';
import CreateGroupForm from './CreateGroupForm';
import QuitGroupButton from './QuitGroupButton';

export default async function FriendsDialog() {
    const feedUsers = await db.select().from(user).limit(10);
    const { user: authUser } = await validateRequest();
    if (!authUser) {
        redirect('/');
    }

    const data = await db.query.friendList.findFirst({
        where: (friendList, { eq }) => eq(friendList.userId, authUser.id),
        with: {
            friendship: {
                with: {
                    friend: true,
                },
            },
        },
    });

    const groupData = await db.query.groupMember.findMany({
        where: (groupMember, { eq }) => eq(groupMember.userId, authUser.id),
        with: {
            group: {
                with: {
                    groupMembers: {
                        with: {
                            member: true,
                        },
                    },
                },
            },
        },
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='outline' className='flex items-center gap-1'>
                    <Contact width={15} height={15} />
                    Friends
                </Button>
            </DialogTrigger>
            <DialogContent className='flex min-h-[60vw] min-w-[80vw] flex-col sm:min-h-[600px] sm:min-w-[800px]'>
                <DialogHeader></DialogHeader>
                <Tabs defaultValue='friends' className='w-full'>
                    <div className='flex items-center justify-between'>
                        <TabsList>
                            <TabsTrigger value='friends'>Friends</TabsTrigger>
                            <TabsTrigger value='groups'>Groups</TabsTrigger>
                        </TabsList>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size='icon' variant='outline'>
                                    <Plus width={15} height={15} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>
                                    Add new friend or group
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant='ghost'
                                            className='w-full'
                                        >
                                            <div className='w-full text-left'>
                                                Add new friend
                                            </div>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className='flex min-h-[60vh] min-w-[80vw] flex-col sm:min-h-[600px] sm:min-w-[800px]'>
                                        <DialogHeader className='h-[10px]'></DialogHeader>
                                        <SearchForm feedUsers={feedUsers} />
                                    </DialogContent>
                                </Dialog>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant='ghost'
                                            className='w-full'
                                        >
                                            <div className='w-full text-left'>
                                                Create new group
                                            </div>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className='flex max-h-[60vh] min-h-[60vh] min-w-[80vw] flex-col sm:min-h-[600px] sm:min-w-[800px]'>
                                        <DialogHeader>
                                            Create new group
                                        </DialogHeader>
                                        <CreateGroupForm
                                            friends={data?.friendship}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <TabsContent value='friends'>
                        <div className='flex max-h-[50vh] flex-col items-center gap-2 overflow-y-scroll'>
                            {data?.friendship.length === 0 ? (
                                <div>
                                    You don&apos;t have any friends yet :(
                                </div>
                            ) : (
                                data?.friendship.map((d) => (
                                    <Card
                                        key={d.id}
                                        className='flex min-h-[60px] w-full items-center justify-between px-10'
                                    >
                                        <div className='flex items-center gap-6'>
                                            <Avatar className='hidden sm:block'>
                                                <AvatarImage src='https://github.com/shadcn.png' />
                                                <AvatarFallback>
                                                    CN
                                                </AvatarFallback>
                                            </Avatar>
                                            <div key={d.id}>
                                                {d.friend.username}
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <Button variant='outline'>
                                                Invite
                                            </Button>
                                            <DeleteFriendButton
                                                friendId={d.friendId}
                                            />
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value='groups'>
                        <div className='flex max-h-[50vh] flex-col items-center gap-2 overflow-y-scroll'>
                            {groupData.map((g) => (
                                <Card
                                    key={g.id}
                                    className='flex min-h-[60px] w-full items-center justify-between px-10'
                                >
                                    <div className='flex items-center gap-4'>
                                        <div className='text-sm'>
                                            Name:{' '}
                                            <span className='text-base font-semibold'>
                                                {g.group.groupName}
                                            </span>
                                        </div>
                                        <div className='text-sm'>
                                            Users:{' '}
                                            {g.group.groupMembers.map((u) => (
                                                <span
                                                    key={u.id}
                                                    className='text-base font-semibold'
                                                >
                                                    {u.member.username}{' '}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <QuitGroupButton groupId={g.groupId} />
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
