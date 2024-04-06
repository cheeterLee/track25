import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

export default function AuthModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Login/Signup</Button>
            </DialogTrigger>
            <DialogContent className='w-[325px] md:min-w-[40vw]'>
                <DialogHeader></DialogHeader>
                <Tabs defaultValue='login' className='max-w-full'>
                    <TabsList className='grid w-full grid-cols-2'>
                        <TabsTrigger value='login'>Login</TabsTrigger>
                        <TabsTrigger value='signup'>Signup</TabsTrigger>
                    </TabsList>
                    <TabsContent value='login'>
                        <LoginForm />
                    </TabsContent>
                    <TabsContent value='signup'>
                        <RegisterForm />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
