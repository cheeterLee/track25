'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from './ui/input';
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
import { useRouter } from 'next/navigation';
import { login } from '@/lib/authActions';
import { toast } from './ui/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const FormSchema = z.object({
    username: z
        .string()
        .min(2, 'Username contains at least 2 chars')
        .max(12, 'Username contains at most 12 chars'),
    password: z
        .string()
        .min(6, 'Password contains at least 6 chars')
        .max(20, 'Password contains at most 20 chars'),
});

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsLoading(true);
        const { success, message } = await login(data.username, data.password);
        if (success) {
            toast({
                title: 'Successfully Logged In',
                description: 'You will be redirected to the app page',
                duration: 2000,
            });
            form.reset();
            router.push('/main');
        } else {
            toast({
                variant: 'destructive',
                title: 'Error when trying to login',
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
                        <CardTitle>Login</CardTitle>
                        <CardDescription>Sign in to an account</CardDescription>
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
                    </CardContent>
                    <CardFooter>
                        <Button disabled={isLoading} type='submit'>
                            {isLoading && (
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            )}
                            Login
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}
