import ThemeToggle from './ThemeToggle';
import LogoWrapper from './LogoWrapper';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AuthForm from './AuthForm';
import { login, logout, signup } from '@/lib/authActions';
import { validateRequest } from '@/lib/auth';
import { User } from 'lucide-react';

export default async function Navbar() {
    const { user } = await validateRequest();

    return (
        <div className='flex h-[100px] w-full items-center justify-between border-2 border-pink-300 px-1 md:px-6 lg:px-40'>
            <LogoWrapper />
            <div className='flex items-center gap-2'>
                {!user ? (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Login/Signup</Button>
                        </DialogTrigger>
                        <DialogContent className='w-[325px] md:min-w-[40vw]'>
                            <DialogHeader></DialogHeader>
                            <Tabs defaultValue='login' className='max-w-full'>
                                <TabsList className='grid w-full grid-cols-2'>
                                    <TabsTrigger value='login'>
                                        Login
                                    </TabsTrigger>
                                    <TabsTrigger value='signup'>
                                        Signup
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value='login'>
                                    <AuthForm action={login}>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Login</CardTitle>
                                                <CardDescription>
                                                    Sign in to an account
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className='space-y-2'>
                                                <div className='space-y-1'>
                                                    <Label htmlFor='username'>
                                                        Username:
                                                    </Label>
                                                    <Input
                                                        id='username'
                                                        name='username'
                                                        defaultValue=''
                                                    />
                                                </div>
                                                <div className='space-y-1'>
                                                    <Label htmlFor='password'>
                                                        Password:
                                                    </Label>
                                                    <Input
                                                        id='password'
                                                        name='password'
                                                        defaultValue=''
                                                    />
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                <Button>Login</Button>
                                            </CardFooter>
                                        </Card>
                                    </AuthForm>
                                </TabsContent>
                                <TabsContent value='signup'>
                                    <AuthForm action={signup}>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Signup</CardTitle>
                                                <CardDescription>
                                                    Register a new account
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className='space-y-2'>
                                                <div className='space-y-1'>
                                                    <Label htmlFor='username'>
                                                        Username:
                                                    </Label>
                                                    <Input
                                                        id='username'
                                                        name='username'
                                                        type='username'
                                                    />
                                                </div>
                                                <div className='space-y-1'>
                                                    <Label htmlFor='password'>
                                                        Password
                                                    </Label>
                                                    <Input
                                                        id='password'
                                                        name='password'
                                                        type='password'
                                                    />
                                                </div>
                                                <div className='space-y-1'>
                                                    <Label htmlFor='confirmPassword'>
                                                        Confirm Password:
                                                    </Label>
                                                    <Input
                                                        id='confirmPassword'
                                                        name='confirmPassword'
                                                        type='password'
                                                    />
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                <Button>Sign up</Button>
                                            </CardFooter>
                                        </Card>
                                    </AuthForm>
                                </TabsContent>
                            </Tabs>
                        </DialogContent>
                    </Dialog>
                ) : (
                    <div className='flex items-center gap-1'>
                        <User />
                        <span className='text-sm'>{user.username}</span>
                        <AuthForm action={logout}>
                            <Button>Logout</Button>
                        </AuthForm>
                    </div>
                )}
                <ThemeToggle />
            </div>
        </div>
    );
}
