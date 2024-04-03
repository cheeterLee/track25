import Image from 'next/image';
import Link from 'next/link';

export default function ShowcasePage() {

    return (
        <div className='max-h-screen overflow-y-scroll'>
            <Link href='/home/showcase#upload-gpx-file'>To upload</Link>
            <h3 id='light-and-dark-mode-support'>
                Light and dark mode support
            </h3>
            <Image
                src='/theme.gif'
                alt='theme showcase'
                width={800}
                height={600}
            />
            <h3 id='upload-gpx-file'>Upload GPX file</h3>
            <Image
                src='/upload.gif'
                alt='upload showcase'
                width={800}
                height={600}
            />
            <h3>Interacting with the map and download GPX data</h3>
            <Image
                src='/interact.gif'
                alt='interact showcase'
                width={800}
                height={600}
            />
        </div>
    );
}
