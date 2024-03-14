import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { db } from '@/db';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from 'lucia';
import SubscribeButton from './SubscribeButton';
import { Plan } from '@/lib/type';

const plans: Plan[] = [
    {
        id: 'price_1Ou199Jzk4dgmXDAidQSYMX2',
        name: 'Monthly',
        priceStr: '5£ per month',
    },
    {
        id: 'price_1Ou1HMJzk4dgmXDAMa5jEnt7',
        name: 'Quarterly',
        priceStr: '10£ per quarter',
    },
    {
        id: 'price_1Ou1HcJzk4dgmXDAiB86TAdI',
        name: 'Yearly',
        priceStr: '30£ per month',
    },
];

export default async function BottomBar({ user: authUser }: { user: User }) {
    const user = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.id, authUser.id),
    });

    return (
        <div className='flex h-[100px] max-w-full items-center justify-between px-4'>
            <div className='flex items-center gap-4'>
                <Avatar>
                    <AvatarImage
                        src='https://github.com/shadcn.png'
                        alt='@shadcn'
                    />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='flex flex-col items-center gap-1'>
                    <p>{authUser.username}</p>
                    {user?.isPremium ? (
                        <Badge variant='secondary' className='bg-green-400'>
                            Premium
                        </Badge>
                    ) : (
                        <Badge variant='secondary'>Free</Badge>
                    )}
                </div>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant='outline' size='icon'>
                        <Settings width={20} height={20} />
                    </Button>
                </DialogTrigger>
                <DialogContent className='flex h-[420px] min-w-[80vw] max-w-[80vw] flex-col justify-start overflow-y-scroll sm:min-w-[800px] sm:max-w-[50vw]'>
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue='account' className='h-full w-full'>
                        <TabsList>
                            <TabsTrigger value='profile'>Profile</TabsTrigger>
                            <TabsTrigger value='subscription'>
                                Subscription
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value='profile'
                            className='flex w-full flex-col justify-between gap-6'
                        >
                            <div className='min-h-[250px] border-2 border-pink-200'></div>
                            <div className='flex justify-end'>
                                <Button variant='destructive'>Logout</Button>
                            </div>
                        </TabsContent>
                        <TabsContent
                            value='subscription'
                            className='flex w-full flex-col gap-6'
                        >
                            <div>You are currently on a free plan</div>
                            <div className='grid max-h-full w-full grid-cols-1 gap-1 overflow-y-scroll sm:grid-cols-3'>
                                {plans.map((plan) => (
                                    <Card
                                        key={plan.id}
                                        className='flex h-[250px] flex-col items-center justify-center'
                                    >
                                        <div className='flex flex-col items-center justify-center gap-1'>
                                            <div className='text-2xl'>
                                                {plan.name}
                                            </div>
                                            <div className='text-sm'>
                                                {plan.priceStr}
                                            </div>
                                        </div>
                                        <SubscribeButton plan={plan} />
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </div>
    );
}
