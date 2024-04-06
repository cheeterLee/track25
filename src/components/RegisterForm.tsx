'use client';

import { Input } from './ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { Label } from './ui/label';
import { Button } from './ui/button';
import { signup } from '@/lib/authActions';
import { toast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const FormSchema = z
    .object({
        username: z
            .string()
            .min(2, 'Username contains at least 2 chars')
            .max(12, 'Username contains at most 12 chars'),
        password: z
            .string()
            .min(6, 'Password contains at least 6 chars')
            .max(20, 'Password contains at most 20 chars'),
        confirmPassword: z
            .string()
            .min(6, 'Password contains at least 6 chars')
            .max(20, 'Password contains at most 20 chars'),
    })
    .refine((data) => data.confirmPassword === data.password, {
        message: 'Confirm password should be the same with password',
        path: ['confirmPassword'],
    });

export default function RegisterForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: '',
            password: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsLoading(true);
        const { success, message } = await signup(
            data.username,
            data.password,
            data.confirmPassword,
        );
        if (success) {
            toast({
                title: 'Successfully Registered',
                description: 'You will be redirected to the app page',
                duration: 2000,
            });
            router.push('/main');
        } else {
            toast({
                variant: 'destructive',
                title: 'Error when trying to register',
                description: message,
                duration: 3000,
            });
        }
        setIsLoading(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Signup</CardTitle>
                        <CardDescription>
                            Register a new account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className='flex flex-col gap-2'>
                                            <Label>Username</Label>
                                            <Input {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className='flex flex-col gap-2'>
                                            <Label>Password:</Label>
                                            <Input type='password' {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='confirmPassword'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className='flex flex-col gap-2'>
                                            <Label>Confirm Password:</Label>
                                            <Input type='password' {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button disabled={isLoading} type='submit'>
                            {isLoading && (
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            )}
                            Sign up
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}
