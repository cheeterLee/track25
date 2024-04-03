import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
    return (
        <div
            className='flex max-h-[calc(100vh-100px)] w-screen flex-1 
        flex-col items-center justify-between overflow-y-scroll bg-custom-bg bg-cover 
        bg-center'
        >
            <div className='absolute bottom-0 left-0 right-0 top-[100px] z-[2] bg-black/70' />
            <div className='mt-48 flex flex-col items-center justify-center px-36 md:flex-row md:justify-between'>
                <div className='z-[3] mb-16 ml-8 flex flex-col gap-4'>
                    <h3 className='text-4xl font-bold tracking-wide text-slate-200'>
                        Track25
                    </h3>
                    <p className='text-slate-200'>
                        A web app to display your GPX track data and share it
                        with friends.
                    </p>
                    <Button
                        variant='outline'
                        className='w-[10rem] border-slate-600 bg-transparent font-semibold text-slate-200'
                    >
                        <Link href='/home/showcase'>View use cases</Link>
                    </Button>
                </div>
                <div className='z-[3] mb-10 hidden flex-col items-end md:block md:flex md:flex-row'>
                    <Image src='/web.png' alt='web' width={700} height={500} />
                    <Image
                        src='/mobile.png'
                        alt='mobile'
                        width={150}
                        height={300}
                    />
                </div>
            </div>
            <div className='z-[3] mb-10 mt-10 text-slate-200'>
                <Separator />
                <p>2024&copy; track25</p>
            </div>
        </div>
    );
}
