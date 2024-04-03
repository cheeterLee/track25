import Image from 'next/image';
import Link from 'next/link';

export default function ShowcasePage() {
    return (
        <div className='max-h-[calc(100vh-100px)] overflow-y-scroll'>
            <Link href='/home/showcase#upload-gpx-file'>To upload</Link>
            <h3 id='light-and-dark-mode-support'>
                Subscribe and unsubscribe to a premium plan
            </h3>
            <Image
                src='/sub.gif'
                alt='sub showcase'
                width={800}
                height={600}
                placeholder='blur'
                blurDataURL='/sub.gif'
            />
            <h3 id='upload-gpx-file'>Upload GPX file</h3>
            <Image
                src='/upload.gif'
                alt='upload showcase'
                width={800}
                height={600}
                placeholder='blur'
                blurDataURL='/upload.gif'
            />
            <h3>Interacting with the map and download GPX data</h3>
            <Image
                src='/interact.gif'
                alt='interact showcase'
                width={800}
                height={600}
                placeholder='blur'
                blurDataURL='/interact.gif'
            />
            <h3>Add friend, share track with friend and manage track access</h3>
            <Image
                src='/share.gif'
                alt='share showcase'
                width={800}
                height={600}
                placeholder='blur'
                blurDataURL='/share.gifk'
            />
        </div>
    );
}
