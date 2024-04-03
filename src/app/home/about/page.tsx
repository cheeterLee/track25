import { Separator } from '@/components/ui/separator';

export default function AboutPage() {
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
                        About
                    </h3>
                    <Separator className='z-[3] bg-slate-200' />
                </div>
                <p className='text-lg'>
                    A web app to display your GPX track data and share it with
                    friends.
                </p>
                <div className='flex flex-col items-start gap-1'>
                    <p>
                        <span className='text-xl font-semibold'>&#183;</span>{' '}
                        Allow user to upload personal GPX track and download
                        later.
                    </p>
                    <p>
                        <span className='text-xl font-semibold'>&#183;</span>{' '}
                        Allow user view insights derived from their GPX data and
                        interact with the map.
                    </p>
                    <p>
                        <span className='text-xl font-semibold'>&#183;</span>{' '}
                        Allow user to add friends with other users or create
                        friend groups,
                    </p>
                    <p>
                        <span className='text-xl font-semibold'>&#183;</span>{' '}
                        Allow user to share track with friends or friend groups.
                    </p>
                    <p>
                        <span className='text-xl font-semibold'>&#183;</span>{' '}
                        Allow user to subscribe to a premium plan or change plan
                        or cancel plan at anytime.
                    </p>
                </div>
                <div className='mt-6 flex flex-col items-start gap-2'>
                    <div className='flex w-full justify-center text-lg font-semibold'>
                        <p>Tech Stack</p>
                    </div>
                    <div>
                        <span>Framework: </span>NextJS with React Server
                        Component
                    </div>
                    <div>
                        <span>Language: </span>TypeScript
                    </div>
                    <div>
                        <span>Styling: </span>TailwindCSS, ShadCN UI
                    </div>
                    <div>
                        <span>State management: </span>Zustand
                    </div>
                    <div>
                        <span>Database and ORM: </span>PostgreSQL by Neon,
                        DrizzleORM
                    </div>
                    <div>
                        <span>External Library: </span>Stripe, Mapbox, Vercel
                        Blob
                    </div>
                    <div>
                        <span>Testing: </span>Jest, Cypress
                    </div>
                </div>
            </div>
            <div className='z-[3] mb-10 mt-10 text-slate-200'>
                <Separator className='bg-slate-200' />
                <p>2024&copy; track25</p>
            </div>
        </div>
    );
}
