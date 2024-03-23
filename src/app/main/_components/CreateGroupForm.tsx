'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { createGroup } from '@/lib/friendActions';
import { User } from '@/lib/type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface Friend {
    id: string;
    userId: string;
    friendListId: string;
    friendId: string;
    createdAt: Date | null;
    friend: User;
}

const FormSchema = z.object({
    groupName: z
        .string()
        .min(2, 'At least 2 chars')
        .max(10, 'At most 10 chars'),
    friends: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: 'Must select at least one item.',
    }),
});

export default function CreateGroupForm({
    friends,
}: {
    friends: Friend[] | undefined;
}) {
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            groupName: '',
            friends: [],
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const { success } = await createGroup(data.groupName, data.friends);
        if (success) {
            toast({
                title: 'Successfully sent group invitation',
            });
        }
        startTransition(() => {
            router.refresh();
        });
    }

    return (
        <div className='flex h-full w-full flex-1'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='flex w-full flex-col justify-between space-y-8'
                >
                    <div className='flex flex-col gap-4'>
                        <FormField
                            control={form.control}
                            name='groupName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Group Name:</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='group name...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='friends'
                            render={() => (
                                <FormItem>
                                    <div className='mb-4 max-h-[35vh] w-full'>
                                        <FormLabel className=''>
                                            Invite Friends
                                        </FormLabel>
                                    </div>
                                    <div className='max-h-[27vh] overflow-y-scroll'>
                                        {friends?.length === 0 ? (
                                            <div className='text-sm font-semibold'>
                                                You don&apos;t have any friends
                                                yet :(
                                            </div>
                                        ) : (
                                            friends?.map((f) => (
                                                <FormField
                                                    key={f.friend.id}
                                                    control={form.control}
                                                    name='friends'
                                                    render={({ field }) => {
                                                        return (
                                                            <Card className='flex min-h-[60px] w-full items-center justify-start gap-6 px-10'>
                                                                <FormItem
                                                                    key={
                                                                        f.friend
                                                                            .id
                                                                    }
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(
                                                                                f
                                                                                    .friend
                                                                                    .id,
                                                                            )}
                                                                            onCheckedChange={(
                                                                                checked,
                                                                            ) => {
                                                                                return checked
                                                                                    ? field.onChange(
                                                                                          [
                                                                                              ...field.value,
                                                                                              f
                                                                                                  .friend
                                                                                                  .id,
                                                                                          ],
                                                                                      )
                                                                                    : field.onChange(
                                                                                          field.value?.filter(
                                                                                              (
                                                                                                  value,
                                                                                              ) =>
                                                                                                  value !==
                                                                                                  f
                                                                                                      .friend
                                                                                                      .id,
                                                                                          ),
                                                                                      );
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                                <Avatar className='hidden sm:block'>
                                                                    <AvatarImage src='https://github.com/shadcn.png' />
                                                                    <AvatarFallback>
                                                                        CN
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    {
                                                                        f.friend
                                                                            .username
                                                                    }
                                                                </div>
                                                            </Card>
                                                        );
                                                    }}
                                                />
                                            ))
                                        )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex justify-end'>
                        <Button type='submit'>Submit</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
