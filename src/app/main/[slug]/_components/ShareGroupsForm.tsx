'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { shareWithGroup, shareWithUser } from '@/actions/trackAccessActions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface Group {
    id: string;
    userId: string;
    groupId: string;
    group: {
        id: string;
        groupName: string | null;
        creatorId: string;
        groupMembers: {
            id: string;
            userId: string;
            groupId: string;
            member: {
                id: string;
                username: string;
            };
        }[];
    };
}

const FormSchema = z.object({
    groups: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: 'Must select at least one group',
    }),
});

export default function ShareGroupsForm({
    trackId,
    groups,
}: {
    trackId: string | undefined;
    groups: Group[];
}) {
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            groups: [],
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const { success } = await shareWithGroup(trackId, data.groups);

        if (success) {
            toast({
                title: 'Successfully shared',
            });
            startTransition(() => {
                router.refresh();
            });
        }
    }

    return (
        <div className='flex h-full w-full flex-1'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='flex w-full flex-col justify-between space-y-8'
                >
                    <FormField
                        control={form.control}
                        name='groups'
                        render={() => (
                            <FormItem>
                                <div className='flex max-h-[40vh] min-h-[40vh] flex-col gap-2 overflow-y-scroll'>
                                    {groups?.length === 0 ? (
                                        <div className='text-sm font-semibold'>
                                            You don&apos;t have any groups yet
                                            :(
                                        </div>
                                    ) : (
                                        groups?.map((g) => (
                                            <FormField
                                                key={g.id}
                                                control={form.control}
                                                name='groups'
                                                render={({ field }) => {
                                                    return (
                                                        <Card className='flex min-h-[60px] w-full items-center justify-start gap-6 px-10'>
                                                            <FormItem
                                                                key={g.group.id}
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(
                                                                            g
                                                                                .group
                                                                                .id,
                                                                        )}
                                                                        onCheckedChange={(
                                                                            checked,
                                                                        ) => {
                                                                            return checked
                                                                                ? field.onChange(
                                                                                      [
                                                                                          ...field.value,
                                                                                          g
                                                                                              .group
                                                                                              .id,
                                                                                      ],
                                                                                  )
                                                                                : field.onChange(
                                                                                      field.value?.filter(
                                                                                          (
                                                                                              value,
                                                                                          ) =>
                                                                                              value !==
                                                                                              g
                                                                                                  .group
                                                                                                  .id,
                                                                                      ),
                                                                                  );
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                            <div>
                                                                {
                                                                    g.group
                                                                        .groupName
                                                                }
                                                            </div>
                                                            <div className='text-sm'>
                                                                Members:{' '}
                                                                <span>
                                                                    {g.group.groupMembers
                                                                        .slice(
                                                                            0,
                                                                            3,
                                                                        )
                                                                        .map(
                                                                            (
                                                                                m,
                                                                            ) => (
                                                                                <span
                                                                                    key={
                                                                                        m.id
                                                                                    }
                                                                                    className='text-xs font-semibold'
                                                                                >
                                                                                    {
                                                                                        m
                                                                                            .member
                                                                                            .username
                                                                                    }{' '}
                                                                                </span>
                                                                            ),
                                                                        )}
                                                                    ...
                                                                </span>
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
                    <div className='flex justify-end'>
                        <Button type='submit'>Submit</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
