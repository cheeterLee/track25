'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { User } from '@/lib/type';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function SearchForm({ feedUsers }: { feedUsers: User[] }) {
    const [matchedUsers, setMatchedUsers] = useState<User[] | null>(null);

    return (
        <div className='flex h-full w-full flex-1 flex-col gap-2'>
            <div className='flex justify-between gap-2'>
                <div className='flex flex-1 items-center'>
                    <Search
                        width={15}
                        height={15}
                        className='translate-x-8 text-slate-300'
                    />
                    <Input placeholder='search for users' className='pl-10' />
                </div>
                <Button variant='secondary'>Search</Button>
            </div>
            <Separator />
            <div className='max-h-[50vh] flex-1 overflow-y-scroll'>
                {matchedUsers === null ? (
                    <div className='flex flex-col gap-3'>
                        <div className='text-md font-semibold'>
                            Users you may know
                        </div>
                        <div className='flex flex-col gap-1'>
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
                                    <Button variant='secondary'>Add</Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : matchedUsers.length === 0 ? (
                    <div>no results</div>
                ) : (
                    <div>results</div>
                )}
            </div>
        </div>
    );
}
