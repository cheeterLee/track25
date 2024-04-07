'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { User } from '@/lib/type';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import InvitationButton from './InvitationButton';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { searchUser } from '@/actions/friendActions';

const FormSchema = z.object({
    searchText: z.string(),
});

export default function SearchForm({
    feedUsers,
    existingFriendsIds,
}: {
    feedUsers: User[];
    existingFriendsIds: string[];
}) {
    const [matchedUsers, setMatchedUsers] = useState<User[] | null>(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            searchText: '',
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const { matchedUsers } = await searchUser(data.searchText);
        if (matchedUsers?.length === 0) {
            setMatchedUsers([]);
        } else {
            setMatchedUsers(matchedUsers ?? []);
        }
    }

    return (
        <div className='flex h-full w-full flex-1 flex-col gap-2'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='flex justify-between gap-2'>
                        <div className='flex flex-1 items-center'>
                            <FormField
                                control={form.control}
                                name='searchText'
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormControl>
                                            <div className='flex w-full items-center'>
                                                <Search
                                                    width={15}
                                                    height={15}
                                                    className='translate-x-8 text-slate-300'
                                                />
                                                <Input
                                                    placeholder='search for users'
                                                    className='pl-10'
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type='submit' variant='secondary'>
                            Search
                        </Button>
                    </div>
                </form>
            </Form>
            <Separator />
            <div className='max-h-[50vh] flex-1 overflow-y-scroll'>
                {matchedUsers === null ? (
                    <div className='flex flex-col gap-3'>
                        <div className='text-md font-semibold'>
                            Users you may know
                        </div>
                        <div className='flex flex-col gap-2'>
                            {feedUsers.map((u) => (
                                <Card
                                    key={u.id}
                                    className='flex h-[60px] items-center justify-between px-12'
                                >
                                    <div className='flex items-center gap-3'>
                                        <Avatar>
                                            <AvatarImage src='https://github.com/shadcn.png' />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div>{u.username}</div>
                                    </div>
                                    <InvitationButton
                                        type='friend'
                                        receiverId={u.id}
                                        buttonDisabled={existingFriendsIds.includes(
                                            u.id,
                                        )}
                                    />
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : matchedUsers.length === 0 ? (
                    <div className='mt-6 text-center text-lg font-semibold'>
                        No results :(
                    </div>
                ) : (
                    <div className='flex flex-col gap-2'>
                        {matchedUsers.map((u) => (
                            <Card
                                key={u.id}
                                className='flex h-[60px] items-center justify-between px-12'
                            >
                                <div className='flex items-center gap-3'>
                                    <Avatar>
                                        <AvatarImage src='https://github.com/shadcn.png' />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div>{u.username}</div>
                                </div>
                                <InvitationButton
                                    type='friend'
                                    receiverId={u.id}
                                    buttonDisabled={existingFriendsIds.includes(
                                        u.id,
                                    )}
                                />
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
