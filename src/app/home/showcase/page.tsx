import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';

export default function ShowcasePage() {
    return (
        <div className='flex max-h-[calc(100vh-100px)] w-screen bg-custom-bg bg-cover bg-center'>
            <div className='absolute bottom-0 left-0 right-0 top-[100px] z-[2] bg-black/70' />
            <div
                className='z-[3] flex hidden h-[calc(100vh-100px)] w-[450px] flex-col items-start
             gap-2 border-r-2 border-dashed border-slate-400 pt-32 md:block'
            >
                <div className='ml-4 text-xl font-semibold text-slate-200'>
                    Table Of Content
                </div>
                <Button variant='link'>
                    <Link
                        href='/home/showcase#sub-and-unsub'
                        className='text-slate-200'
                    >
                        1. Subscribe a premium plan and unsubscribe
                    </Link>
                </Button>
                <Button variant='link'>
                    <Link
                        href='/home/showcase#upload-gpx-file'
                        className='text-slate-200'
                    >
                        2. Upload GPX file
                    </Link>
                </Button>
                <Button variant='link'>
                    <Link
                        href='/home/showcase#interact-with-map'
                        className='text-slate-200'
                    >
                        3. Interacting with the map and download GPX data
                    </Link>
                </Button>
                <Button variant='link'>
                    <Link
                        href='/home/showcase#share-with-friend'
                        className='text-slate-200'
                    >
                        4. Add friend, share track with friend and manage track
                        access
                    </Link>
                </Button>
            </div>
            <div
                className='z-[3] ml-0 flex flex-1 flex-col items-center gap-8 
            overflow-y-scroll py-8 text-slate-200 md:ml-4 md:items-start'
            >
                <div className='flex flex-col gap-3'>
                    <h3 id='sub-and-unsub' className='font-semibold'>
                        1. Subscribe and unsubscribe to a premium plan
                    </h3>
                    <Image
                        src='/sub.gif'
                        alt='sub showcase'
                        width={900}
                        height={700}
                        placeholder='blur'
                        blurDataURL='/sub.gif'
                    />
                </div>
                <Separator className='bg-slate-200' />
                <div className='flex flex-col gap-3'>
                    <h3 id='upload-gpx-file' className='font-semibold'>
                        2. Upload GPX file
                    </h3>
                    <Image
                        src='/upload.gif'
                        alt='upload showcase'
                        width={900}
                        height={700}
                        placeholder='blur'
                        blurDataURL='/upload.gif'
                    />
                </div>
                <Separator className='bg-slate-200' />
                <div className='flex flex-col gap-3'>
                    <h3 id='interact-with-map' className='font-semibold'>
                        3. Interacting with the map and download GPX data
                    </h3>
                    <Image
                        src='/interact.gif'
                        alt='interact showcase'
                        width={900}
                        height={700}
                        placeholder='blur'
                        blurDataURL='/interact.gif'
                    />
                </div>
                <Separator className='bg-slate-200' />
                <div className='flex flex-col gap-3'>
                    <h3 id='share-with-friend' className='font-semibold'>
                        4. Add friend, share track with friend and manage track
                        access
                    </h3>
                    <Image
                        src='/share.gif'
                        alt='share showcase'
                        width={900}
                        height={700}
                        placeholder='blur'
                        blurDataURL='/share.gifk'
                    />
                </div>
                <div className='z-[3] mb-10 mt-10 flex w-full flex-col items-center text-slate-200'>
                    <Separator className='bg-slate-200' />
                    <p>2024&copy; track25</p>
                </div>
            </div>
        </div>
    );
}
