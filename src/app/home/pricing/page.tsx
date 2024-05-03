import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
        priceStr: '30£ per year',
    },
];

export default function PricingPage() {
    return (
        <div
            className='flex max-h-[calc(100vh-100px)] w-screen flex-1 
        flex-col items-center justify-between overflow-y-scroll 
        bg-custom-bg bg-cover bg-center'
        >
            <div className='absolute bottom-0 left-0 right-0 top-[100px] z-[2] bg-black/70' />
            <div className='z-[3] mt-20 flex w-full flex-col items-center gap-3 px-8 text-slate-200'>
                <div className='flex w-full flex-col items-center'>
                    <h3 className='mb-1 text-2xl font-bold tracking-wide'>
                        Pricing
                    </h3>
                    <Separator className='z-[3] bg-slate-200' />
                </div>
                <div className='flex flex-col items-start gap-1'>
                    <p className='text-lg'>
                        <span className='text-teal-400'>Free Plan: </span>{' '}
                        Limited to 5 GPX file uploads.
                    </p>
                    <p className='text-lg'>
                        <span className='text-teal-400'>Premium Plan: </span>{' '}
                        Unlimited file uploads, able to change username.
                    </p>
                </div>
                <div className='mt-8 grid max-h-full w-full grid-cols-1 gap-1 overflow-y-scroll px-16 sm:grid-cols-3'>
                    {plans.map((plan) => (
                        <Card
                            key={plan.id}
                            className='flex h-[250px] flex-col items-center justify-center border-slate-200 bg-transparent text-slate-200'
                        >
                            <div className='flex flex-col items-center justify-center gap-1'>
                                <div className='text-2xl'>{plan.name}</div>
                                <div className='text-sm text-orange-400'>
                                    {plan.priceStr}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
            <div className='z-[3] mb-10 mt-10 text-slate-200'>
                <Separator className='bg-slate-200' />
                <p>2024&copy; track25</p>
            </div>
        </div>
    );
}
