'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { User } from 'lucia';
import { Button } from '@/components/ui/button';
import { startTransition, useState } from 'react';
import { changeUsername } from '@/lib/settingsActions';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

const FormSchema = z.object({
    changedUsername: z
        .string()
        .min(2, 'At least 2 chars')
        .max(20, 'At most 10 chars'),
});

export default function SettingsForm({ user }: { user: User }) {
    const [inEditMode, setInEditMode] = useState<boolean>(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            changedUsername: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const { success, error } = await changeUsername(data.changedUsername);
        if (success) {
            toast({
                title: 'Successfully changed',
            });
            startTransition(() => {
                router.refresh();
            });
            setInEditMode(false);
        } else {
            if (error !== null) {
                toast({
                    variant: 'destructive',
                    title: error,
                });
            }
        }
    };

    return (
        <div className='min-h-[250px] rounded-lg border-2 border-dashed border-slate-300 p-6'>
            {!inEditMode ? (
                <div className='flex items-center justify-start gap-28'>
                    <div className='w-30'>
                        Username:{' '}
                        <span className='font-semibold'>{user.username}</span>
                    </div>
                    <Button
                        variant='outline'
                        onClick={() => setInEditMode(true)}
                    >
                        Edit Username
                    </Button>
                </div>
            ) : (
                <Form {...form}>
                    <form
                        className='flex w-full items-center gap-8'
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name='changedUsername'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder={user.username}
                                            {...field}
                                            className='w-[200px]'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex items-center gap-2'>
                            <Button type='submit' variant='outline'>
                                Submit
                            </Button>
                            <Button
                                onClick={() => setInEditMode(false)}
                                variant='outline'
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
}
